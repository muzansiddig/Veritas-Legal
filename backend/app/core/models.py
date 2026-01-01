from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, JSON, DateTime, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

# Association table for User-Case relationships if needed
# (Assuming simple RBAC for now)

class Firm(Base):
    __tablename__ = "firms"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, index=True)
    jurisdiction = Column(String)
    timezone = Column(String)
    currency = Column(String, default="USD")
    practice_areas = Column(JSON)  # List of strings
    employee_counts = Column(JSON) # e.g., {"lawyer": 5, "assistant": 2}
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    users = relationship("User", back_populates="firm")

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    first_name = Column(String)
    last_name = Column(String)
    role = Column(String) # Owner, Lawyer, Paralegal, Assistant, Admin
    is_active = Column(Boolean, default=True)
    firm_id = Column(String, ForeignKey("firms.id"))
    
    firm = relationship("Firm", back_populates="users")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Case(Base):
    __tablename__ = "cases"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, index=True)
    description = Column(String)
    case_number = Column(String, unique=True, index=True)
    court = Column(String)
    judge = Column(String)
    status = Column(String, default="Open") # Open, Closed, Pending, Appealed
    case_types = Column(JSON) # Multiple types supported
    metadata_fields = Column(JSON) # Flexible metadata
    firm_id = Column(String, ForeignKey("firms.id"))
    registered_at = Column(DateTime(timezone=True), server_default=func.now())
    
    firm = relationship("Firm")
    evidence = relationship("Evidence", back_populates="case")
    tasks = relationship("Task", back_populates="case")
    events = relationship("Event", back_populates="case")
    invoices = relationship("Invoice", back_populates="case")

class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(String, primary_key=True, default=generate_uuid)
    case_id = Column(String, ForeignKey("cases.id"))
    title = Column(String)
    type = Column(String) # Document, Image, Audio, Video
    source = Column(String)
    collected_at = Column(DateTime(timezone=True))
    file_hash = Column(String)
    storage_path = Column(String)
    status = Column(String, default="Pending") # Pending, Accepted, Rejected
    audit_chain = Column(JSON) # Chain of custody logs
    
    previous_hash = Column(String) # Link to previous evidence for chaining
    firm_id = Column(String, ForeignKey("firms.id"), index=True) # Direct isolation
    
    case = relationship("Case", back_populates="evidence")
    firm = relationship("Firm")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SystemAudit(Base):
    __tablename__ = "system_audits"

    id = Column(String, primary_key=True, default=generate_uuid)
    action = Column(String) # CREATE, UPDATE, DELETE, VIEW, DOWNLOAD
    table_name = Column(String)
    record_id = Column(String)
    user_id = Column(String, ForeignKey("users.id"))
    firm_id = Column(String, ForeignKey("firms.id"), index=True) # Isolation of logs
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    details = Column(JSON) # Contextual info
    row_hash = Column(String) # SHA-256 of the entry for integrity

class Task(Base):
    __tablename__ = "tasks"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, index=True)
    description = Column(String)
    due_date = Column(DateTime(timezone=True))
    status = Column(String, default="Pending") # Pending, In Progress, Completed
    assigned_to = Column(String, ForeignKey("users.id"))
    case_id = Column(String, ForeignKey("cases.id"))
    firm_id = Column(String, ForeignKey("firms.id"), index=True)
    
    case = relationship("Case", back_populates="tasks")
    assignee = relationship("User")
    firm = relationship("Firm")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Event(Base):
    __tablename__ = "events"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, index=True)
    description = Column(String)
    start_time = Column(DateTime(timezone=True))
    end_time = Column(DateTime(timezone=True))
    location = Column(String)
    case_id = Column(String, ForeignKey("cases.id"))
    firm_id = Column(String, ForeignKey("firms.id"), index=True)
    
    case = relationship("Case", back_populates="events")
    firm = relationship("Firm")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(String, primary_key=True, default=generate_uuid)
    case_id = Column(String, ForeignKey("cases.id"))
    total_amount = Column(Integer) # In cents
    status = Column(String, default="Draft") # Draft, Sent, Paid, Overdue
    due_date = Column(DateTime(timezone=True))
    firm_id = Column(String, ForeignKey("firms.id"), index=True)
    
    case = relationship("Case", back_populates="invoices")
    items = relationship("InvoiceItem", back_populates="invoice")
    firm = relationship("Firm")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class InvoiceItem(Base):
    __tablename__ = "invoice_items"

    id = Column(String, primary_key=True, default=generate_uuid)
    invoice_id = Column(String, ForeignKey("invoices.id"))
    description = Column(String)
    amount = Column(Integer) # In cents
    
    invoice = relationship("Invoice", back_populates="items")

class AnalysisJob(Base):
    __tablename__ = "analysis_jobs"

    id = Column(String, primary_key=True, default=generate_uuid)
    evidence_id = Column(String, ForeignKey("evidence.id"))
    firm_id = Column(String, ForeignKey("firms.id"), index=True)
    status = Column(String, default="Pending") # Pending, Processing, Completed, Failed
    result = Column(JSON) # Structured XAI findings (schemas.AnalysisResult)
    reasoning_path = Column(JSON) # Step-wise AI logic
    model_name = Column(String)
    latency_ms = Column(Integer)
    tokens_used = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    evidence = relationship("Evidence")
    firm = relationship("Firm")
