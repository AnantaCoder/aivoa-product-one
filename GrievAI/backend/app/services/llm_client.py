import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI
from app.config import settings

def get_llm(model_name: str = settings.GEMINI_MODEL, temperature: float = 0.1) -> ChatGoogleGenerativeAI:
    """
    Returns a configured Gemini LLM from LangChain.
    Ensures that the API key is passed explicitly if it's not set in the environment.
    """
    # Prefer settings but fallback to os environment
    api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")
    
    # We will use dummy API key if none is provided, but it will fail at runtime if a real one isn't used
    if not api_key:
        print("Warning: GEMINI_API_KEY is not set. API calls will fail.")
        
    return ChatGoogleGenerativeAI(
        model=model_name,
        temperature=temperature,
        google_api_key=api_key
    )

def get_nvidia_llm(model_name: str = settings.DEEPSEEK_MODEL, temperature: float = 0.1) -> ChatOpenAI:
    """
    Returns a configured NVIDIA NIM LLM (e.g. DeepSeek) from LangChain.
    Connects to NVIDIA NIM's OpenAI-compatible endpoint with streaming enabled to avoid proxy read timeouts.
    """
    api_key = settings.DEEPSEEK_API_KEY or os.getenv("DEEPSEEK_API_KEY", "")

    if not api_key:
        print("Warning: DEEPSEEK_API_KEY is not set. API calls will fail.")
        
    return ChatOpenAI(
        base_url="https://integrate.api.nvidia.com/v1",
        api_key=api_key,
        model=model_name,
        temperature=temperature,
        streaming=True
    )
    
if __name__ == "__main__":                                
    print("Testing DeepSeek LLM")
    llm = get_nvidia_llm()
    response = llm.invoke("Hello, how are you?")
    print(response.content)