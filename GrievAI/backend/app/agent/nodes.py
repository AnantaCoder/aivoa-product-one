import json
from app.agent.state import ComplaintState
from app.agent.prompts import EXTRACTION_SYSTEM_PROMPT, EXTRACTION_PROMPT, VALIDATION_PROMPT, RISK_CLASSIFICATION_PROMPT
from app.services.llm_client import get_llm

def parse_json_from_llm_response(response_text) -> dict:
    """Helper to clean and parse JSON from LLM response"""
    if isinstance(response_text, list):
        text_parts = []
        for part in response_text:
            if isinstance(part, str):
                text_parts.append(part)
            elif isinstance(part, dict) and "text" in part:
                text_parts.append(part["text"])
        response_text = "".join(text_parts)
        
    try:
        # Strip markdown formatting if the model still includes it
        cleaned = response_text.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        return json.loads(cleaned.strip())
    except json.JSONDecodeError:
        print(f"Failed to parse JSON: {response_text}")
        return {}

async def extract_fields_node(state: ComplaintState) -> ComplaintState:
    llm = get_llm()
    prompt = EXTRACTION_SYSTEM_PROMPT + "\n\n" + EXTRACTION_PROMPT.format(text=state["raw_text"])
    
    try:
        response = await llm.ainvoke(prompt)
        extracted = parse_json_from_llm_response(response.content)
        state["extracted_fields"] = extracted
    except Exception as e:
        state["errors"].append(f"Extraction error: {str(e)}")
        state["extracted_fields"] = {}
        
    return state

async def validate_completeness_node(state: ComplaintState) -> ComplaintState:
    if not state.get("extracted_fields"):
        state["completeness_report"] = {"missing_fields": [], "completeness_score": 0, "is_complete": False}
        return state
        
    llm = get_llm()
    prompt = VALIDATION_PROMPT.format(extracted_data=json.dumps(state["extracted_fields"], indent=2))
    
    try:
        response = await llm.ainvoke(prompt)
        report = parse_json_from_llm_response(response.content)
        state["completeness_report"] = report
    except Exception as e:
        state["errors"].append(f"Validation error: {str(e)}")
        state["completeness_report"] = {"missing_fields": [], "completeness_score": 0, "is_complete": False}
        
    return state

async def classify_risk_node(state: ComplaintState) -> ComplaintState:
    if not state.get("extracted_fields"):
        state["risk_assessment"] = {}
        state["summary"] = ""
        return state
        
    llm = get_llm()
    fields = state["extracted_fields"]
    prompt = RISK_CLASSIFICATION_PROMPT.format(
        product_name=fields.get("product_name", "Unknown"),
        batch_number=fields.get("batch_number", "Unknown"),
        description=fields.get("description", "Unknown")
    )
    
    try:
        response = await llm.ainvoke(prompt)
        risk_data = parse_json_from_llm_response(response.content)
        
        state["risk_assessment"] = {
            "initial_severity": risk_data.get("initial_severity", "Minor"),
            "priority": risk_data.get("priority", "Low"),
            "risk_category": risk_data.get("risk_category", "Unknown"),
            "risk_rationale": risk_data.get("risk_rationale", "")
        }
        state["suggested_capa"] = risk_data.get("suggested_capa", "")
        state["summary"] = risk_data.get("ai_summary", "")
        
    except Exception as e:
        state["errors"].append(f"Risk classification error: {str(e)}")
        state["risk_assessment"] = {}
        state["summary"] = ""
        
    return state
