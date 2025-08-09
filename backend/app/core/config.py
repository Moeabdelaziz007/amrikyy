"""
Application configuration using Pydantic Settings
"""

from typing import List, Optional
from pydantic import BaseSettings, validator
import os

class Settings(BaseSettings):
    # Application
    PROJECT_NAME: str = "Amrikyy AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    ALLOWED_HOSTS: List[str] = ["*"]
    
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost/amrikyy_ai"
    DATABASE_POOL_SIZE: int = 10
    DATABASE_MAX_OVERFLOW: int = 20
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    CACHE_TTL: int = 3600  # 1 hour
    
    # OpenAI
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4"
    OPENAI_EMBEDDING_MODEL: str = "text-embedding-3-large"
    OPENAI_MAX_TOKENS: int = 4000
    OPENAI_TEMPERATURE: float = 0.1
    
    # Vector Database
    VECTOR_DB_TYPE: str = "pinecone"  # pinecone, weaviate, chromadb
    PINECONE_API_KEY: str = ""
    PINECONE_ENVIRONMENT: str = ""
    PINECONE_INDEX_NAME: str = "amrikyy-ai"
    WEAVIATE_URL: str = "http://localhost:8080"
    WEAVIATE_API_KEY: str = ""
    
    # Document Processing
    MAX_FILE_SIZE: int = 50 * 1024 * 1024  # 50MB
    ALLOWED_FILE_TYPES: List[str] = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "text/markdown"
    ]
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 200
    
    # RAG Configuration
    RETRIEVAL_TOP_K: int = 10
    RERANK_TOP_K: int = 5
    MIN_CONFIDENCE_THRESHOLD: float = 0.3
    
    # Memory Settings
    MEMORY_MAX_ITEMS: int = 10000
    MEMORY_DECAY_DAYS: int = 30
    MEMORY_IMPORTANCE_THRESHOLD: float = 0.3
    CONVERSATION_HISTORY_LIMIT: int = 50
    
    # File Storage
    STORAGE_TYPE: str = "local"  # local, s3
    LOCAL_STORAGE_PATH: str = "./storage"
    S3_BUCKET: str = ""
    S3_REGION: str = "us-east-1"
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    
    # Celery
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/1"
    
    # Monitoring
    SENTRY_DSN: Optional[str] = None
    PROMETHEUS_ENABLED: bool = True
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    @validator("ALLOWED_HOSTS", pre=True)
    def assemble_allowed_hosts(cls, v):
        if isinstance(v, str):
            return [host.strip() for host in v.split(",")]
        return v
    
    @validator("DATABASE_URL", pre=True)
    def assemble_db_connection(cls, v):
        if v and not v.startswith("postgresql"):
            raise ValueError("DATABASE_URL must start with 'postgresql'")
        return v
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create global settings instance
settings = Settings()
