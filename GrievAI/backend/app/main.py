from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.db.database import Base, engine
from app.api import complaints, chat

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="GrievAI Backend",
    description="AI-Powered Customer Complaint Management System API",
    version="1.0.0"
)

# Set up CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(complaints.router, prefix="/api/complaints", tags=["Complaints"])
app.include_router(complaints.router, prefix="/api", tags=["Legacy Compatibility"]) # For /api/analyze fallback
app.include_router(chat.router, prefix="/api/complaints", tags=["Chat Copilot"])

@app.get("/")
@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "GrievAI Backend is running", "model": settings.GEMINI_MODEL}
