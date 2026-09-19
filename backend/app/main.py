from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.session import engine, Base
from app.db import models
from app.api.endpoints import chat, grievance, auth, tts

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Multilingual Cooperative Governance & Legal Assistance AI Platform (SIH 2026)",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(auth.router, prefix=settings.API_V1_STR, tags=["Authentication & Farmer Access"])
app.include_router(chat.router, prefix=settings.API_V1_STR, tags=["Chat & Legal Assistance"])
app.include_router(grievance.router, prefix=settings.API_V1_STR, tags=["Grievance Redressal"])
app.include_router(tts.router, prefix=settings.API_V1_STR, tags=["Speech & Voice"])

@app.get("/")
def root():
    return {
        "project": "Raithu Velugu",
        "description": "Multilingual Cooperative Governance & Legal Assistance AI Kiosk",
        "hackathon": "Smart India Hackathon 2026 (SIH26088)",
        "docs": "/api/docs"
    }

@app.get(f"{settings.API_V1_STR}/health")
def health_check():
    return {"status": "healthy", "service": "Raithu Velugu API", "version": "1.0.0"}

@app.get(f"{settings.API_V1_STR}/languages")
def get_supported_languages():
    return [
        {"code": "en", "name": "English", "native": "English", "flag": "🇮🇳"},
        {"code": "te", "name": "Telugu", "native": "తెలుగు", "flag": "🌾"},
        {"code": "hi", "name": "Hindi", "native": "हिन्दी", "flag": "🇮🇳"},
        {"code": "kn", "name": "Kannada", "native": "ಕನ್ನಡ", "flag": "🌾"},
        {"code": "ta", "name": "Tamil", "native": "தமிழ்", "flag": "🌾"},
        {"code": "mr", "name": "Marathi", "native": "मराठी", "flag": "🌾"}
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
