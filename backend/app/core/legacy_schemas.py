from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Tasks
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    status: Optional[str] = "Pending"
    assigned_to: Optional[str] = None
    case_id: str

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Events
class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime
    location: Optional[str] = None
    case_id: str

class EventCreate(EventBase):
    pass

class Event(EventBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Invoices
class InvoiceItemBase(BaseModel):
    description: str
    amount: int

class InvoiceItemCreate(InvoiceItemBase):
    pass

class InvoiceItem(InvoiceItemBase):
    id: str
    invoice_id: str

    class Config:
        from_attributes = True

class InvoiceBase(BaseModel):
    case_id: str
    total_amount: int
    status: Optional[str] = "Draft"
    due_date: datetime

class InvoiceCreate(InvoiceBase):
    items: List[InvoiceItemCreate]

class Invoice(InvoiceBase):
    id: str
    created_at: datetime
    items: List[InvoiceItem]

    class Config:
        from_attributes = True

# Search
class SearchResult(BaseModel):
    type: str # Case, Task, Evidence
    id: str
    title: str
    description: Optional[str] = None
    relevance: Optional[float] = 0.0
