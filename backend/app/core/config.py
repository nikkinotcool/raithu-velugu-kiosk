import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Raithu Velugu - Multilingual Cooperative AI Kiosk"
    API_V1_STR: str = "/api"
    
    # Database URL: Supports SQLite or PostgreSQL / Supabase
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./raithu_velugu.db")
    
    # LLM Settings (Groq / Qwen / Cloud / Local)
    LLM_MODEL_NAME: str = os.getenv("GEMMA_MODEL_NAME", "qwen/qwen3.8-27b")
    GEMMA_MODEL_NAME: str = os.getenv("GEMMA_MODEL_NAME", "qwen/qwen3.8-27b")
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")
    LLM_API_BASE: str = os.getenv("LLM_API_BASE", "https://api.groq.com/openai/v1")
    
    # Bhashini Speech & Translation API
    BHASHINI_USER_ID: str = os.getenv("BHASHINI_USER_ID", "")
    BHASHINI_API_KEY: str = os.getenv("BHASHINI_API_KEY", "")
    BHASHINI_PIPELINE_ID: str = os.getenv("BHASHINI_PIPELINE_ID", "")
    
    # CORS
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "*"
    ]

    @property
    def normalized_database_url(self) -> str:
        # If user provides Supabase postgres:// URI, normalize to postgresql:// for SQLAlchemy
        url = self.DATABASE_URL
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        return url

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
