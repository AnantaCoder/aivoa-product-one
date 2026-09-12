from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    GEMINI_API_KEY: str = ""
    DATABASE_URL: str = "sqlite:///./complaints.db"
    GEMINI_MODEL: str = "gemini-3.1-flash-lite"
    PORT: int = 5000
    DEEPSEEK_API_KEY: str = ""
    DEEPSEEK_MODEL: str = "deepseek-ai/deepseek-v4-pro-0813"
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173"
    ]

settings = Settings()
