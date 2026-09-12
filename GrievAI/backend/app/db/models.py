import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, Integer
from app.db.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    ticket_number = Column(String(50), unique=True, index=True)
    
    # Origin & Customer
    complaint_source = Column(String(100))
    customer_name = Column(String(200))
    
    # Product & Batch
    product_name = Column(String(200))
    product_strength = Column(String(100))
    batch_number = Column(String(100), index=True)
    manufacturing_date = Column(String(50))
    expiry_date = Column(String(50))
    quantity_affected = Column(String(50))
    
    # Complaint Details
    complaint_type = Column(String(100))
    complaint_date = Column(String(50))
    description = Column(Text)
    
    # Assessment
    initial_severity = Column(String(50))
    priority = Column(String(50))
    status = Column(String(50), default="Pending Triage", index=True)
    
    # AI Analytics
    ai_summary = Column(Text, nullable=True)
    completeness_score = Column(Integer, nullable=True)
    missing_fields = Column(Text, nullable=True) # JSON string
    risk_category = Column(String(100), nullable=True)
    risk_rationale = Column(Text, nullable=True)
    suggested_capa = Column(Text, nullable=True)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
