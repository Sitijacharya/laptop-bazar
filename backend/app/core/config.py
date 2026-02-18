from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "mysql+pymysql://root@localhost:3306/laptopbazar"
    
    # JWT
    SECRET_KEY: str = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Upload
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 5242880  # 5MB
    
    # CORS
    CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:5173"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        env_file_encoding = 'utf-8'


settings = Settings()
