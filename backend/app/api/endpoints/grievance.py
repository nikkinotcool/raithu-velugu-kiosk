import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.schemas.grievance import GrievanceCreate, GrievanceOut, GrievanceStatusQuery
from app.db.session import get_db
from app.db.models import Grievance

router = APIRouter()

@router.post("/grievances", response_model=GrievanceOut)
def create_grievance(req: GrievanceCreate, db: Session = Depends(get_db)):
    """Lodge a new grievance ticket with automatic tracking ID and government routing."""
    date_str = datetime.utcnow().strftime("%Y%m%d")
    random_code = uuid.uuid4().hex[:6].upper()
    tracking_id = f"RV-GRV-{date_str}-{random_code}"
    
    routed_to = "District ARCS Office & PACS Inspection Cell"
    if "PMFBY" in req.category or "Insurance" in req.category:
        routed_to = "District Agricultural Insurance Grievance Committee (DAIGC)"
    elif "Loan" in req.category:
        routed_to = "District Central Cooperative Bank (DCCB) Inspection Wing"

    new_g = Grievance(
        tracking_id=tracking_id,
        category=req.category,
        description=req.description,
        complainant_name=req.complainant_name or "Anonymous Farmer",
        complainant_phone=req.complainant_phone,
        pacs_name=req.pacs_name or "Kandi Primary Agricultural Credit Society",
        status="Submitted - Under Review",
        routed_to=routed_to,
        created_at=datetime.utcnow()
    )
    db.add(new_g)
    db.commit()
    db.refresh(new_g)
    return new_g

def seed_demo_grievances_if_empty(db: Session):
    """Seed realistic demonstration grievance tickets if they don't already exist."""
    # Prune legacy corrupted test ticket if present
    db.query(Grievance).filter(Grievance.tracking_id == "RV-GRV-20260922-0DA102").delete()
    
    current_ids = {g[0] for g in db.query(Grievance.tracking_id).all()}
    to_add = []
    if "RV-GRV-20260921-UR8812" not in current_ids:
        to_add.append(Grievance(
            tracking_id="RV-GRV-20260921-UR8812",
            category="Fertilizer & Certified Seed Quota Denial",
            description="PACS fertilizer counter delayed Urea distribution during peak sowing. Requested urgent additional quota release.",
            complainant_name="K. Ramu (కే. రాము)",
            complainant_phone="9876543210",
            pacs_name="Kandi Primary Agricultural Credit Society",
            status="Resolved",
            routed_to="Agricultural Extension Officer & DCCB Sangareddy",
            created_at=datetime.utcnow()
        ))
    if "RV-GRV-20260922-PM5541" not in current_ids:
        to_add.append(Grievance(
            tracking_id="RV-GRV-20260922-PM5541",
            category="PMFBY Crop Loss Claim Delay / Rejection",
            description="Heavy localized inundation in Sy. No. 142/A Paddy fine crop. 72-hour loss intimation submitted.",
            complainant_name="Nikhil",
            complainant_phone="9390336984",
            pacs_name="Kandi Primary Agricultural Credit Society",
            status="Under ARCS Inquiry",
            routed_to="District Agricultural Insurance Grievance Committee (DAIGC)",
            created_at=datetime.utcnow()
        ))
    if "RV-GRV-20260923-LN1094" not in current_ids:
        to_add.append(Grievance(
            tracking_id="RV-GRV-20260923-LN1094",
            category="PACS 4% Crop Loan or Interest Subsidy Issue",
            description="Scale of finance entitlement inquiry for Kharif Paddy ₹38,000/acre under 4% interest subvention scheme.",
            complainant_name="Nikhil",
            complainant_phone="9390336984",
            pacs_name="Kandi Primary Agricultural Credit Society",
            status="Submitted - Under Review",
            routed_to="District Central Cooperative Bank (DCCB) Inspection Wing",
            created_at=datetime.utcnow()
        ))
    if to_add:
        db.add_all(to_add)
        db.commit()

@router.get("/grievances", response_model=List[GrievanceOut])
def list_grievances(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    """Fetch all grievance tickets for Admin oversight."""
    seed_demo_grievances_if_empty(db)
    grievances = db.query(Grievance).order_by(Grievance.created_at.desc()).offset(skip).limit(limit).all()
    return grievances

@router.get("/grievances/track/{tracking_id}", response_model=GrievanceOut)
def track_grievance(tracking_id: str, db: Session = Depends(get_db)):
    """Look up a specific grievance ticket by Tracking ID."""
    seed_demo_grievances_if_empty(db)
    grievance = db.query(Grievance).filter(Grievance.tracking_id == tracking_id.strip()).first()
    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance ticket not found. Please verify tracking ID.")
    return grievance

@router.patch("/grievances/{tracking_id}/status")
def update_grievance_status(tracking_id: str, new_status: str, db: Session = Depends(get_db)):
    """Update status of a grievance ticket (e.g. Under Investigation, Resolved)."""
    grievance = db.query(Grievance).filter(Grievance.tracking_id == tracking_id).first()
    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance ticket not found")
    
    grievance.status = new_status
    grievance.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(grievance)
    return {"status": "success", "tracking_id": tracking_id, "new_status": grievance.status}
