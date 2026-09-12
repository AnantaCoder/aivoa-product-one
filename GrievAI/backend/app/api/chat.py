import json
from fastapi import APIRouter, HTTPException
from app.schemas.complaint import ChatRequest, ChatResponse
from app.agent.prompts import CHAT_SYSTEM_PROMPT
from app.services.llm_client import get_llm
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat_with_copilot(request: ChatRequest):
    """
    AI Copilot Chat Endpoint.
    Contextualizes chat using current complaint data and history.
    """
    llm = get_llm()
    structured_llm = llm.with_structured_output(ChatResponse)
    
    messages = [SystemMessage(content=CHAT_SYSTEM_PROMPT)]
    
    if request.complaint_data:
        context_str = json.dumps(request.complaint_data, indent=2)
        messages.append(SystemMessage(content=f"Current Complaint Context:\n{context_str}"))
        
    if request.history:
        for msg in request.history:
            role = msg.get("sender", "user")
            text = msg.get("text", "")
            if role == "user":
                messages.append(HumanMessage(content=text))
            elif role == "ai":
                messages.append(AIMessage(content=text))
                
    messages.append(HumanMessage(content=request.message))
    
    try:
        response = await structured_llm.ainvoke(messages)
        return response
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get AI response")

if __name__ == "__main__":
    print("Testing Chat Endpoint")
    request = ChatRequest(
        message="What is the capital of France?",
        complaint_data=None,
        history=[]
    )
    # Note: chat_with_copilot is async now, so calling it directly in sync context won't work well without asyncio.run