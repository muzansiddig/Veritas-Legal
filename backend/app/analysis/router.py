from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.core import models, database, security
from . import service, schemas

router = APIRouter(prefix="/analysis", tags=["analysis"])

@router.post("/{evidence_id}", response_model=schemas.AnalysisJob)
async def trigger_analysis(
    evidence_id: str, 
    background_tasks: BackgroundTasks, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    # 1. Fetch evidence (Strict Firm Isolation)
    evidence = db.query(models.Evidence).filter(
        models.Evidence.id == evidence_id,
        models.Evidence.firm_id == current_user.firm_id
    ).first()
    
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence not found")

    # 2. Create AnalysisJob Record
    job = models.AnalysisJob(
        evidence_id=evidence_id,
        firm_id=current_user.firm_id,
        status="Pending"
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    # 3. Trigger Async Task
    background_tasks.add_task(service.AIService.analyze_evidence, evidence_id, job.id, db)
    
    # 4. Audit
    security.log_audit(
        db, current_user.id, current_user.firm_id, "TRIGGER_ANALYSIS", "analysis_jobs", job.id
    )

    return job

@router.get("/{evidence_id}/status", response_model=schemas.AnalysisJob)
async def get_analysis_status(
    evidence_id: str, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    # Query the latest job for this evidence and firm
    job = db.query(models.AnalysisJob).filter(
        models.AnalysisJob.evidence_id == evidence_id,
        models.AnalysisJob.firm_id == current_user.firm_id
    ).order_by(models.AnalysisJob.created_at.desc()).first()
    
    if not job:
        raise HTTPException(status_code=404, detail="No analysis jobs found for this evidence")

    return job
