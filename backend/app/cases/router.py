from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
import hashlib
from datetime import datetime
from app.core import models, database, firebase as firebase_setup, security as auth
from app.analysis import service as ai_service
from . import schemas as case_schemas
from app.core.security import get_current_user, require_roles

router = APIRouter(prefix="/cases", tags=["cases"])

# Removed mock get_current_firm_id

@router.post("/", response_model=case_schemas.Case)
def create_case(
    case: case_schemas.CaseCreate, 
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(require_roles(["Owner", "Lawyer", "Admin"]))
):
    db_case = models.Case(
        **case.dict(),
        firm_id=current_user.firm_id
    )
    db.add(db_case)
    
    # Secure Audit Entry via centralized helper
    auth.log_audit(
        db, 
        current_user.id, 
        current_user.firm_id, 
        "CREATE_CASE", 
        "cases", 
        db_case.id, 
        {"title": db_case.title}
    )
    
    db.commit()
    db.refresh(db_case)
    return db_case

@router.get("/", response_model=List[case_schemas.Case])
def list_cases(
    cursor: Optional[str] = None, 
    limit: int = 20, 
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(get_current_user)
):
    query = db.query(models.Case).filter(models.Case.firm_id == current_user.firm_id)
    
    if cursor:
        query = query.filter(models.Case.id > cursor) # Simple ID-based cursor
        
    cases = query.order_by(models.Case.id).limit(limit).all()
    return cases

@router.get("/{case_id}", response_model=case_schemas.Case)
def get_case(case_id: str, db: Session = Depends(database.get_db)):
    db_case = db.query(models.Case).filter(models.Case.id == case_id).first()
    if not db_case:
        raise HTTPException(status_code=404, detail="Case not found")
    return db_case

@router.post("/{case_id}/lock", response_model=case_schemas.Case)
def lock_case(
    case_id: str, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(require_roles(["Owner", "Admin"]))
):
    db_case = db.query(models.Case).filter(
        models.Case.id == case_id, 
        models.Case.firm_id == current_user.firm_id
    ).first()
    
    if not db_case:
        raise HTTPException(status_code=404, detail="Case not found")
        
    db_case.status = "Locked"
    db.commit()
    
    auth.log_audit(
        db, current_user.id, current_user.firm_id, "LOCK_CASE", "cases", case_id
    )
    return db_case

@router.post("/{case_id}/evidence", response_model=case_schemas.Evidence)
async def add_evidence(
    case_id: str, 
    title: str,
    type: str,
    source: str,
    file: UploadFile = File(...), 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(require_roles(["Owner", "Lawyer", "Paralegal", "Admin"]))
):
    # 0. Check Case Lock Status
    db_case = db.query(models.Case).filter(models.Case.id == case_id).first()
    if db_case and db_case.status == "Locked":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Case is LOCKED. No new evidence can be added for integrity reasons."
        )

    # 1. Read file and calculate hash
    content = await file.read()
    file_hash = hashlib.sha256(content).hexdigest()
    
    # 2. Upload to Firebase Storage
    bucket = firebase_setup.get_bucket()
    if bucket:
        blob = bucket.blob(f"evidence/{case_id}/{file_hash}_{file.filename}")
        blob.upload_from_string(content, content_type=file.content_type)
        storage_path = blob.name
    else:
        storage_path = f"local_storage/{case_id}/{file.filename}" # Fallback
    
    # 3. Handle cryptographic chaining (Enterprise Integrity)
    previous_evidence = db.query(models.Evidence).filter(
        models.Evidence.case_id == case_id
    ).order_by(models.Evidence.created_at.desc()).first()
    
    previous_hash = previous_evidence.file_hash if previous_evidence else "GENESIS"

    # 4. Create database record
    db_evidence = models.Evidence(
        case_id=case_id,
        title=title,
        type=type,
        source=source,
        file_hash=file_hash,
        storage_path=storage_path,
        previous_hash=previous_hash,
        firm_id=current_user.firm_id,
        status="Pending",
        audit_chain=[{
            "action": "Uploaded",
            "timestamp": datetime.utcnow().isoformat(),
            "user": current_user.email,
            "hash": file_hash,
            "previous_hash": previous_hash
        }]
    )
    db.add(db_evidence)
    
    # 5. Create System Audit entry via centralized helper
    auth.log_audit(
        db,
        current_user.id,
        current_user.firm_id,
        "CREATE_EVIDENCE",
        "evidence",
        db_evidence.id,
        {"case_id": case_id, "file_name": file.filename}
    )
    
    db.commit()
    db.refresh(db_evidence)
    return db_evidence

    return db_evidence

from fastapi.responses import HTMLResponse
from app.core import exporter

@router.get("/{case_id}/export", response_class=HTMLResponse)
def export_case(
    case_id: str, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Generates a professional judicial-grade dossier for the case.
    """
    db_case = db.query(models.Case).filter(
        models.Case.id == case_id,
        models.Case.firm_id == current_user.firm_id
    ).first()
    
    if not db_case:
        raise HTTPException(status_code=404, detail="Case not found or access denied")
    
    report_html = exporter.generate_case_report(db_case)
    
    # Audit the export
    auth.log_audit(
        db, current_user.id, current_user.firm_id, "EXPORT_DOSSIER", "cases", case_id
    )
    
    return report_html

@router.get("/{case_id}/timeline")
def get_case_timeline(case_id: str, db: Session = Depends(database.get_db)):
    db_case = db.query(models.Case).filter(models.Case.id == case_id).first()
    if not db_case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    timeline = ai_service.AIService.generate_timeline(db_case)
    return timeline
