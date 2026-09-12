from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Request
from sqlalchemy.orm import Session
from typing import List, Optional
import json

from app.db.database import get_db
from app.db.models import Complaint
from app.schemas.complaint import (
    ComplaintResponse, 
    ComplaintCreate, 
    ExtractedComplaintResponse, 
    ComplaintExtractRequest,
    RiskAssessmentRequest,
    RiskAssessmentResponse
)
from app.parsers.document import parse_document
from app.agent.graph import run_extraction_agent
from app.agent.nodes import parse_json_from_llm_response
from app.agent.prompts import RISK_CLASSIFICATION_PROMPT
from app.services.llm_client import get_llm

router = APIRouter()

@router.post("/analyze", response_model=ExtractedComplaintResponse)
@router.post("/extract", response_model=ExtractedComplaintResponse)
async def extract_complaint(
    request: Request,
    text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    """
    Extract structured fields from raw complaint text or uploaded document (PDF/DOCX/EML/TXT).
    Endpoints /analyze and /extract are aliased to support existing frontend integrations.
    """
    raw_text = ""
    filename = None
    file_type = None

    if file and file.filename:
        content = await file.read()
        filename = file.filename
        file_type = file.content_type
        try:
            raw_text = parse_document(filename, content)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to read document: {str(e)}")
    elif text:
        raw_text = text
    else:
        # Check if sent as application/json body
        content_type = request.headers.get("content-type", "")
        if "application/json" in content_type:
            try:
                json_data = await request.json()
                raw_text = json_data.get("text", "")
            except Exception:
                pass

    if not raw_text:
        raise HTTPException(status_code=400, detail="Must provide either complaint text or document upload.")
        
    if not raw_text.strip():
        if filename and filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=400,
                detail="PDF appears to contain no extractable text (it might be a scanned image or empty). Please upload a searchable/text-based PDF or paste text directly."
            )
        raise HTTPException(status_code=400, detail="Document appears to be empty.")

    # Run LangGraph pipeline
    state = await run_extraction_agent(raw_text, filename, file_type)
    
    fields = state.get("extracted_fields", {})
    risk = state.get("risk_assessment", {})
    report = state.get("completeness_report", {})
    summary = state.get("summary", "")
    
    # Construct response
    response_data = {
        "complaint_source": fields.get("complaint_source", ""),
        "customer_name": fields.get("customer_name", ""),
        "product_name": fields.get("product_name", ""),
        "product_strength": fields.get("product_strength", ""),
        "batch_number": fields.get("batch_number", ""),
        "manufacturing_date": fields.get("manufacturing_date", ""),
        "expiry_date": fields.get("expiry_date", ""),
        "quantity_affected": fields.get("quantity_affected", ""),
        "complaint_type": fields.get("complaint_type", ""),
        "complaint_date": fields.get("complaint_date", ""),
        "description": fields.get("description", ""),
        "detailed_complaint_description": fields.get("description", ""),
        
        "initial_severity": risk.get("initial_severity", ""),
        "priority": risk.get("priority", ""),
        "risk_category": risk.get("risk_category", ""),
        "risk_rationale": risk.get("risk_rationale", ""),
        "suggested_capa": state.get("suggested_capa", ""),
        
        "ai_summary": summary,
        "summary": summary,
        "completeness_score": report.get("completeness_score", None),
        "missing_fields": report.get("missing_fields", []),
    }
    
    return ExtractedComplaintResponse(**response_data)

@router.post("/risk-assessment", response_model=RiskAssessmentResponse)
async def assess_risk(request: RiskAssessmentRequest):
    """
    Perform a risk assessment based on product name, batch number, and description.
    """
    llm = get_llm()
    prompt = RISK_CLASSIFICATION_PROMPT.format(
        product_name=request.product_name or "Unknown",
        batch_number=request.batch_number or "Unknown",
        description=request.description or "Unknown"
    )
    
    try:
        response = await llm.ainvoke(prompt)
        risk_data = parse_json_from_llm_response(response.content)
        
        return RiskAssessmentResponse(
            initial_severity=risk_data.get("initial_severity", "Minor"),
            priority=risk_data.get("priority", "Low"),
            risk_category=risk_data.get("risk_category", "Unknown"),
            risk_rationale=risk_data.get("risk_rationale", ""),
            suggested_capa=risk_data.get("suggested_capa", ""),
            ai_summary=risk_data.get("ai_summary", "")
        )
    except Exception as e:
        print(f"Risk classification error: {e}")
        raise HTTPException(status_code=500, detail="Failed to perform risk assessment")


@router.post("")
@router.post("/", response_model=ComplaintResponse)
async def create_complaint(complaint_data: ComplaintCreate, db: Session = Depends(get_db)):
    """
    Save a new complaint to the database.
    """
    # Create DB model
    new_complaint = Complaint(**complaint_data.model_dump(exclude_unset=True))
    
    # Set AI specific fields if they exist in the incoming data
    # (Since ComplaintCreate doesn't have AI fields, they might be passed separately, 
    # but for this simple version we trust whatever frontend sends or defaults to DB setup)
    
    db.add(new_complaint)
    db.commit()
    db.refresh(new_complaint)
    
    # Generate an auto-ticket number if none
    if not new_complaint.ticket_number:
        new_complaint.ticket_number = f"QA-{new_complaint.created_at.year}-{new_complaint.id[:6].upper()}"
        db.commit()
        db.refresh(new_complaint)
        
    return new_complaint

@router.get("")
@router.get("/", response_model=List[ComplaintResponse])
async def list_complaints(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Get a list of all complaints.
    """
    complaints = db.query(Complaint).order_by(Complaint.created_at.desc()).offset(skip).limit(limit).all()
    return complaints

@router.get("/{complaint_id}", response_model=ComplaintResponse)
async def get_complaint(complaint_id: str, db: Session = Depends(get_db)):
    """
    Get a specific complaint by ID.
    """
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return complaint
