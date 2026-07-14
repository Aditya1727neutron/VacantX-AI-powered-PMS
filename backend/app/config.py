"""
Application configuration and settings.
"""
import os

# Database
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./parking.db")

# JWT
SECRET_KEY = os.getenv("SECRET_KEY", "smart-parking-secret-key-2026-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# AI Module
AI_MODULE_URL = os.getenv("AI_MODULE_URL", "http://localhost:8001")

# CORS
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
]
