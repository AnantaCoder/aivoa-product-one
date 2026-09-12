from langgraph.graph import StateGraph, START, END
from app.agent.state import ComplaintState
from app.agent.nodes import extract_fields_node, validate_completeness_node, classify_risk_node

def create_complaint_graph():
    # Define a new graph
    workflow = StateGraph(ComplaintState)

    # Add nodes
    workflow.add_node("extract", extract_fields_node)
    workflow.add_node("validate", validate_completeness_node)
    workflow.add_node("classify", classify_risk_node)

    # Define edges (linear flow)
    workflow.add_edge(START, "extract")
    workflow.add_edge("extract", "validate")
    workflow.add_edge("validate", "classify")
    workflow.add_edge("classify", END)

    # Compile it into an executable app
    app = workflow.compile()
    return app

# Singleton instance of the compiled graph
complaint_graph = create_complaint_graph()

async def run_extraction_agent(raw_text: str, filename: str = None, file_type: str = None) -> ComplaintState:
    """Helper to initialize state and run the graph"""
    initial_state = ComplaintState(
        raw_text=raw_text,
        file_name=filename,
        file_type=file_type,
        extracted_fields={},
        completeness_report={},
        risk_assessment={},
        summary="",
        suggested_capa="",
        errors=[]
    )
    
    # Run graph
    final_state = await complaint_graph.ainvoke(initial_state)
    return final_state
