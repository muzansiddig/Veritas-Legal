from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime

class AnalysisClaim(BaseModel):
    finding: str
    confidence: float
    citation: str # evidence_id

class AnalysisRiskFlag(BaseModel):
    type: str # e.g., INTEGRITY_RISK
    severity: str # LOW, MEDIUM, HIGH
    message: str
    citation: str

class AnalysisResult(BaseModel):
    summary: str
    claims: List[AnalysisClaim]
    risk_flags: List[AnalysisRiskFlag]
    model_used: Optional[str] = "Veritas-XAI-v1"
    prompt_version: Optional[str] = "2024.1"

class AnalysisJob(BaseModel):
    id: str
    evidence_id: str
    status: str # Pending, Processing, Verified, Conflict Detected, Failed
    result: Optional[AnalysisResult] = None
    created_at: datetime
    updated_at: Optional[datetime]
