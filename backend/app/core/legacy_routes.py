from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from app.core import models, database, security
from . import legacy_schemas as additional_schemas

router = APIRouter()

# Tasks
@router.post("/tasks", response_model=additional_schemas.Task, tags=["tasks"])
def create_task(
    task: additional_schemas.TaskCreate, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    db_task = models.Task(**task.model_dump(), firm_id=current_user.firm_id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    
    security.log_audit(
        db, current_user.id, current_user.firm_id, "CREATE_TASK", "tasks", db_task.id, {"title": db_task.title}
    )
    return db_task

@router.get("/tasks", response_model=List[additional_schemas.Task], tags=["tasks"])
def list_tasks(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    return db.query(models.Task).filter(models.Task.firm_id == current_user.firm_id).all()

# Calendar
@router.post("/events", response_model=additional_schemas.Event, tags=["calendar"])
def create_event(
    event: additional_schemas.EventCreate, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    db_event = models.Event(**event.model_dump(), firm_id=current_user.firm_id)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

@router.get("/events", response_model=List[additional_schemas.Event], tags=["calendar"])
def list_events(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    return db.query(models.Event).filter(models.Event.firm_id == current_user.firm_id).all()

# Billing
@router.post("/invoices", response_model=additional_schemas.Invoice, tags=["billing"])
def create_invoice(
    invoice: additional_schemas.InvoiceCreate, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    db_invoice = models.Invoice(
        case_id=invoice.case_id,
        total_amount=invoice.total_amount,
        status=invoice.status,
        due_date=invoice.due_date,
        firm_id=current_user.firm_id
    )
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    
    for item in invoice.items:
        db_item = models.InvoiceItem(**item.model_dump(), invoice_id=db_invoice.id)
        db.add(db_item)
    
    db.commit()
    db.refresh(db_invoice)

    security.log_audit(
        db, current_user.id, current_user.firm_id, "CREATE_INVOICE", "invoices", db_invoice.id, {"total": db_invoice.total_amount}
    )
    return db_invoice

@router.get("/invoices", response_model=List[additional_schemas.Invoice], tags=["billing"])
def list_invoices(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    return db.query(models.Invoice).filter(models.Invoice.firm_id == current_user.firm_id).all()

# Global Search with Relevance Foundation
@router.get("/search", response_model=List[additional_schemas.SearchResult], tags=["search"])
def search(
    query: str = Query(...), 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    """
    Enterprise search with foundation for semantic ranking.
    In a production env, this would use pgvector or Elasticsearch.
    """
    results = []
    fid = current_user.firm_id
    query_l = query.lower()
    
    # helper for ranking
    def calculate_relevance(text: str, q: str) -> float:
        if not text: return 0.0
        text = text.lower()
        if q in text: return 0.95
        return 0.5 if any(word in text for word in q.split()) else 0.1

    # Search Cases (Isolated)
    cases = db.query(models.Case).filter(
        models.Case.firm_id == fid,
        (models.Case.title.ilike(f"%{query}%")) | (models.Case.case_number.ilike(f"%{query}%"))
    ).all()
    for c in cases:
        results.append({
            "type": "Case",
            "id": c.id,
            "title": c.title,
            "description": f"No: {c.case_number} | Status: {c.status}",
            "relevance": calculate_relevance(c.title + c.case_number, query_l)
        })
    
    # Search Tasks (Isolated)
    tasks = db.query(models.Task).filter(
        models.Task.firm_id == fid,
        models.Task.title.ilike(f"%{query}%")
    ).all()
    for t in tasks:
        results.append({
            "type": "Task",
            "id": t.id,
            "title": t.title,
            "description": f"Due: {t.due_date.strftime('%Y-%m-%d') if t.due_date else 'N/A'}",
            "relevance": calculate_relevance(t.title, query_l)
        })
        
    # Search Evidence (Isolated)
    evidences = db.query(models.Evidence).filter(
        models.Evidence.firm_id == fid,
        models.Evidence.title.ilike(f"%{query}%")
    ).all()
    for e in evidences:
        results.append({
            "type": "Evidence",
            "id": e.id,
            "title": e.title,
            "description": f"Type: {e.type} | Status: {e.status}",
            "relevance": calculate_relevance(e.title, query_l)
        })
    
    # Sort by relevance (Semantic foundation)
    results.sort(key=lambda x: x["relevance"], reverse=True)
    return results

@router.get("/audit", tags=["audit"])
def get_audit_logs(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    return db.query(models.SystemAudit).filter(
        models.SystemAudit.firm_id == current_user.firm_id
    ).order_by(models.SystemAudit.timestamp.desc()).limit(100).all()
