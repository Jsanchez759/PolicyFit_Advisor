"""Application configuration settings"""
from pydantic_settings import BaseSettings
from typing import List, Optional


class Settings(BaseSettings):
    """Application settings from environment variables"""
    
    # API Configuration
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "PolicyFit Advisor"
    VERSION: str = "1.0.0"
    
    # Server Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = False
    
    # CORS Configuration
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]
    ALLOWED_ORIGIN_REGEX: Optional[str] = None
    
    # Database Configuration (if needed in future)
    DATABASE_URL: str = "sqlite:///./policyfit.db"
    
    # File Upload Configuration
    MAX_UPLOAD_SIZE: int = 50 * 1024 * 1024  # 50MB
    UPLOAD_DIR: str = "./uploads"
    ALLOWED_FILE_TYPES: List[str] = ["pdf"]
    
    # LLM Configuration
    # OpenRouter-compatible OpenAI client settings.
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
    OPENROUTER_API_KEY: str = ""
    OPENROUTER_CHAT_MODEL: str = "openrouter/free"
    OPENROUTER_EMBEDDING_MODEL: str = "nvidia/llama-nemotron-embed-vl-1b-v2:free"
    OPENROUTER_PDF_MODEL: str = "openrouter/free"
    OPENROUTER_PDF_ENGINE: str = "pdf-text"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
