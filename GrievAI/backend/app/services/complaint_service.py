from sqlalchemy.orm import Session
from app.crud import crud_complaint
from app.schemas.complaint import ComplaintCreate

def create_new_complaint(db: Session, complaint_data: ComplaintCreate):
    """
    Creates a new complaint, generates a ticket number, and creates a tracker entry.
    """
    # 1. Create the complaint record
    complaint = crud_complaint.create_complaint(db, complaint_data)
    
    # 2. Generate auto-ticket number
    ticket_number = f"QA-{complaint.created_at.year}-{complaint.id[:6].upper()}"
    complaint = crud_complaint.update_complaint_ticket(db, complaint.id, ticket_number)
    
    # 3. Create tracking record
    crud_complaint.create_complaint_tracker(db, complaint.id)
    
    return complaint

def get_paginated_complaints(db: Session, skip: int = 0, limit: int = 100):
    """
    Retrieves paginated complaints and the total count.
    """
    items = crud_complaint.get_complaints(db, skip=skip, limit=limit)
    total = crud_complaint.get_total_complaints_count(db)
    return {"items": items, "total": total}

def get_complaint_by_id(db: Session, complaint_id: str):
    """
    Retrieves a specific complaint by ID.
    """
    return crud_complaint.get_complaint(db, complaint_id)
