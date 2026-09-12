from typing import TypedDict, Any, Dict, List, Optional
from pydantic import BaseModel

class ComplaintState(TypedDict):
    """
    The state dictionary for the LangGraph Complaint processing agent.
    """
    raw_text: str
    file_name: Optional[str]
    file_type: Optional[str]
    
    extracted_fields: Dict[str, Any]
    completeness_report: Dict[str, Any]
    risk_assessment: Dict[str, Any]
    summary: str
    suggested_capa: Optional[str]
    
    errors: List[str]
