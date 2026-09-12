from sqlalchemy.orm import Session
from app.db.models import Complaint, ComplaintTracker
from app.schemas.complaint import ComplaintCreate

def get_complaint(db: Session, complaint_id: str):
    return db.query(Complaint).filter(Complaint.id == complaint_id).first()

def get_complaints(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Complaint).order_by(Complaint.created_at.desc()).offset(skip).limit(limit).all()

def get_total_complaints_count(db: Session):
    return db.query(ComplaintTracker).count()

def create_complaint(db: Session, complaint: ComplaintCreate):
    db_complaint = Complaint(**complaint.model_dump(exclude_unset=True))
    db.add(db_complaint)
    db.commit()
    db.refresh(db_complaint)
    return db_complaint

def update_complaint_ticket(db: Session, complaint_id: str, ticket_number: str):
    complaint = get_complaint(db, complaint_id)
    if complaint:
        complaint.ticket_number = ticket_number
        db.commit()
        db.refresh(complaint)
    return complaint

def create_complaint_tracker(db: Session, complaint_id: str):
    tracker = ComplaintTracker(complaint_id=complaint_id)
    db.add(tracker)
    db.commit()
    db.refresh(tracker)
    return tracker
