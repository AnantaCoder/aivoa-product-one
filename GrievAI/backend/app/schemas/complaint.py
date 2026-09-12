from typing import Optional, Any, Dict, List
from pydantic import BaseModel, Field, ConfigDict
from pydantic.alias_generators import to_camel

class CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )

class ComplaintExtractRequest(BaseModel):
    text: Optional[str] = None
    # For file uploads, FastAPI UploadFile is used directly in the endpoint.

class ExtractedComplaintResponse(CamelModel):
    complaint_source: str = ""
    customer_name: str = ""
    product_name: str = ""
    product_strength: str = ""
    batch_number: str = ""
    manufacturing_date: str = ""
    expiry_date: str = ""
    quantity_affected: str = ""
    complaint_type: str = ""
    complaint_date: str = ""
    description: str = ""
    detailed_complaint_description: str = ""
    initial_severity: str = ""
    priority: str = ""
    
    # AI Specific fields
    ai_summary: Optional[str] = None
    summary: Optional[str] = None
    completeness_score: Optional[int] = None
    missing_fields: Optional[List[str]] = None
    risk_category: Optional[str] = None
    risk_rationale: Optional[str] = None
    suggested_capa: Optional[str] = None

class ComplaintCreate(CamelModel):
    complaint_source: str
    customer_name: str
    product_name: str
    product_strength: str
    batch_number: str
    manufacturing_date: str
    expiry_date: str
    quantity_affected: str
    complaint_type: str
    complaint_date: str
    description: str
    initial_severity: str
    priority: str
    
    # Optional AI fields that might be passed from frontend
    ai_summary: Optional[str] = None
    completeness_score: Optional[int] = None
    missing_fields: Optional[Any] = None
    risk_category: Optional[str] = None
    risk_rationale: Optional[str] = None
    suggested_capa: Optional[str] = None

class ComplaintResponse(ComplaintCreate):
    id: str
    ticket_number: str
    status: str
    created_at: Any
    
    # AI fields
    ai_summary: Optional[str] = None
    completeness_score: Optional[int] = None
    missing_fields: Optional[Any] = None
    risk_category: Optional[str] = None
    risk_rationale: Optional[str] = None
    suggested_capa: Optional[str] = None

class PaginatedComplaintsResponse(CamelModel):
    items: List[ComplaintResponse]
    total: int

class ChatRequest(BaseModel):
    message: str
    complaint_data: Optional[Dict[str, Any]] = None
    history: Optional[List[Dict[str, str]]] = None

class ChatResponse(BaseModel):
    reply: str
    form_updates: Optional[Dict[str, str]] = None

class RiskAssessmentRequest(CamelModel):
    product_name: str
    batch_number: str
    description: str

class RiskAssessmentResponse(CamelModel):
    initial_severity: str
    priority: str
    risk_category: str
    risk_rationale: str
    suggested_capa: str
    ai_summary: str
