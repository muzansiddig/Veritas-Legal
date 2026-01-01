import hashlib
import time
from sqlalchemy.orm import Session
from . import schemas
from app.core import models, firebase as firebase_setup

class AIService:
    """
    Intelligent Legal Analysis Service with Explainable AI (XAI) principles.
    In a production environment, this integrates with LLMs via Celery/RabbitMQ.
    """

    @staticmethod
    async def analyze_evidence(evidence_id: str, job_id: str, db: Session):
        """
        Explainable AI (XAI) Analysis.
        Every finding MUST be linked to a specific evidence_id (Citation).
        """
        import time
        start_time = time.time()
        
        # 0. Fetch Job and Evidence
        job = db.query(models.AnalysisJob).filter(models.AnalysisJob.id == job_id).first()
        evidence = db.query(models.Evidence).filter(models.Evidence.id == evidence_id).first()
        
        if not job or not evidence:
            return None

        # 1. State Mutation: Processing
        job.status = "Processing"
        evidence.status = "Analyzing"
        db.commit()
        
        # Simulated high-compute processing delay
        time.sleep(2.0) 

        # 2. XAI Structured Output Generation (Enterprise Grade)
        # Mocking the reasoning path as well
        reasoning_path = [
            {"step": "OCR Extraction", "status": "Success", "details": "Extracted 450 words."},
            {"step": "Entity Recognition", "status": "Success", "entities": ["Public Safety Office"]},
            {"step": "Legal Rule Matching", "status": "Success", "rules_applied": ["Procedural Timelines v2"]}
        ]

        xai_analysis = schemas.AnalysisResult(
            summary=f"Veritas-AI analysis for '{evidence.title}' completed successfully.",
            claims=[
                schemas.AnalysisClaim(
                    finding="Document identifies 'Public Safety Office' as the issuing authority.",
                    confidence=0.98,
                    citation=evidence_id
                ),
                schemas.AnalysisClaim(
                    finding="Procedural marker detected: Mandatory Review required by T+48h.",
                    confidence=0.95,
                    citation=evidence_id
                )
            ],
            risk_flags=[],
            model_used="Veritas-XAI-Ensemble-v1",
            prompt_version="2024.01.Enterprise"
        )
        
        # Scenario-based logic for demo/testing
        if "Tech" in (evidence.title or ""):
            xai_analysis.risk_flags.append(schemas.AnalysisRiskFlag(
                type="INTEGRITY_RISK",
                severity="HIGH",
                message="Signature verification failure detected in metadata.",
                citation=evidence_id
            ))
            job.status = "Conflict Detected"
            evidence.status = "Conflict Detected"
        else:
            job.status = "Completed"
            evidence.status = "Verified"

        # 3. Update Job Record
        latency = int((time.time() - start_time) * 1000)
        job.result = xai_analysis.model_dump()
        job.reasoning_path = reasoning_path
        job.model_name = "Veritas-XAI-Ensemble-v1"
        job.latency_ms = latency
        job.tokens_used = 1250 # Mocked
        
        # 4. Legacy Secure Audit Logging (XAI Event)
        new_audit = list(evidence.audit_chain) if evidence.audit_chain else []
        new_audit.append({
            "action": "XAI_REPORT_GENERATED",
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "user": "Veritas-System-AI",
            "details": xai_analysis.model_dump()
        })
        evidence.audit_chain = new_audit
        
        # 4. Persistence into Case Metadata
        case = evidence.case
        current_metadata = dict(case.metadata_fields) if case.metadata_fields else {}
        reports = current_metadata.get("xai_reports", [])
        reports.append(xai_analysis.model_dump())
        case.metadata_fields = {**current_metadata, "xai_reports": reports}

        db.commit()
        return xai_analysis

    @staticmethod
    def generate_timeline(case: models.Case):
        """
        Generates a chronological timeline based on evidence collection dates.
        """
        events = []
        if case.registered_at:
            events.append({
                "date": case.registered_at.isoformat(),
                "title": "Case Registered",
                "description": f"Case {case.case_number} registered by firm {case.firm_id}.",
                "type": "system"
            })
        
        for ev in case.evidence:
            events.append({
                "date": ev.collected_at.isoformat() if ev.collected_at else ev.created_at.isoformat(),
                "title": f"Evidence: {ev.title}",
                "description": f"Status: {ev.status}. Citation: {ev.id}",
                "type": "evidence",
                "evidence_id": ev.id
            })
            
        events.sort(key=lambda x: x["date"])
        return events
