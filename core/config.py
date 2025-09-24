"""
Configuration management for AuraOS
"""

import os
from typing import List, Optional, Dict, Any
from pydantic import BaseSettings, validator, Field
from pathlib import Path

class DatabaseConfig(BaseSettings):
    """Database configuration"""
    url: str = Field(..., env="DATABASE_URL")
    pool_size: int = Field(10, env="DATABASE_POOL_SIZE")
    max_overflow: int = Field(20, env="DATABASE_MAX_OVERFLOW")
    echo: bool = Field(False, env="DATABASE_ECHO")
    
    class Config:
        env_prefix = "DATABASE_"

class RedisConfig(BaseSettings):
    """Redis configuration"""
    url: str = Field(..., env="REDIS_URL")
    password: Optional[str] = Field(None, env="REDIS_PASSWORD")
    db: int = Field(0, env="REDIS_DB")
    max_connections: int = Field(10, env="REDIS_MAX_CONNECTIONS")
    
    class Config:
        env_prefix = "REDIS_"

class SecurityConfig(BaseSettings):
    """Security configuration"""
    secret_key: str = Field(..., env="SECRET_KEY")
    algorithm: str = Field("HS256", env="JWT_ALGORITHM")
    access_token_expire_minutes: int = Field(30, env="JWT_ACCESS_TOKEN_EXPIRE_MINUTES")
    refresh_token_expire_days: int = Field(7, env="JWT_REFRESH_TOKEN_EXPIRE_DAYS")
    allowed_hosts: List[str] = Field(["localhost", "127.0.0.1"], env="ALLOWED_HOSTS")
    cors_origins: List[str] = Field(["http://localhost:3000"], env="CORS_ORIGINS")
    
    @validator('allowed_hosts', pre=True)
    def parse_allowed_hosts(cls, v):
        if isinstance(v, str):
            return [host.strip() for host in v.split(',')]
        return v
    
    @validator('cors_origins', pre=True)
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(',')]
        return v
    
    class Config:
        env_prefix = "SECURITY_"

class MonitoringConfig(BaseSettings):
    """Monitoring configuration"""
    prometheus_port: int = Field(8000, env="PROMETHEUS_PORT")
    grafana_url: str = Field("http://localhost:3000", env="GRAFANA_URL")
    sentry_dsn: Optional[str] = Field(None, env="SENTRY_DSN")
    log_level: str = Field("INFO", env="LOG_LEVEL")
    
    class Config:
        env_prefix = "MONITORING_"

class AIConfig(BaseSettings):
    """AI services configuration"""
    openai_api_key: Optional[str] = Field(None, env="OPENAI_API_KEY")
    anthropic_api_key: Optional[str] = Field(None, env="ANTHROPIC_API_KEY")
    model_temperature: float = Field(0.7, env="AI_MODEL_TEMPERATURE")
    max_tokens: int = Field(1000, env="AI_MAX_TOKENS")
    
    class Config:
        env_prefix = "AI_"

class FirebaseConfig(BaseSettings):
    """Firebase configuration"""
    project_id: str = Field(..., env="FIREBASE_PROJECT_ID")
    storage_bucket: str = Field(..., env="FIREBASE_STORAGE_BUCKET")
    database_url: str = Field(..., env="FIREBASE_DATABASE_URL")
    service_account_key: Optional[str] = Field(None, env="FIREBASE_SERVICE_ACCOUNT_KEY")
    
    class Config:
        env_prefix = "FIREBASE_"

class AppConfig(BaseSettings):
    """Main application configuration"""
    name: str = Field("AuraOS", env="APP_NAME")
    version: str = Field("1.0.0", env="APP_VERSION")
    debug: bool = Field(False, env="DEBUG")
    environment: str = Field("development", env="ENVIRONMENT")
    host: str = Field("0.0.0.0", env="HOST")
    port: int = Field(8000, env="PORT")
    workers: int = Field(1, env="WORKERS")
    reload: bool = Field(True, env="RELOAD")
    
    # Sub-configurations
    database: DatabaseConfig = Field(default_factory=DatabaseConfig)
    redis: RedisConfig = Field(default_factory=RedisConfig)
    security: SecurityConfig = Field(default_factory=SecurityConfig)
    monitoring: MonitoringConfig = Field(default_factory=MonitoringConfig)
    ai: AIConfig = Field(default_factory=AIConfig)
    firebase: FirebaseConfig = Field(default_factory=FirebaseConfig)
    
    @validator('environment')
    def validate_environment(cls, v):
        allowed = ['development', 'staging', 'production']
        if v not in allowed:
            raise ValueError(f'Environment must be one of {allowed}')
        return v
    
    @property
    def is_production(self) -> bool:
        return self.environment == "production"
    
    @property
    def is_development(self) -> bool:
        return self.environment == "development"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False

def get_config() -> AppConfig:
    """Get application configuration"""
    return AppConfig()

def load_env_file(env_file: str = ".env") -> None:
    """Load environment variables from file"""
    env_path = Path(env_file)
    if env_path.exists():
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key.strip()] = value.strip()
