from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime

class EvidenceBase(BaseModel):
    title: str
    type: str
    source: str
    collected_at: datetime

class EvidenceCreate(EvidenceBase):
    case_id: str

class Evidence(EvidenceBase):
    id: str
    case_id: str
    status: str
    file_hash: Optional[str]
    storage_path: Optional[str]
    firm_id: str
    audit_chain: Optional[List[Dict]] = []
    
    class Config:
        from_attributes = True

class CaseBase(BaseModel):
    title: str
    description: str
    case_number: str
    court: str
    judge: str
    case_types: List[str]
    metadata_fields: Optional[Dict] = {}

class CaseCreate(CaseBase):
    pass

class Case(CaseBase):
    id: str
    status: str
    firm_id: str
    registered_at: datetime
    evidence: List[Evidence] = []

    class Config:
        from_attributes = True
