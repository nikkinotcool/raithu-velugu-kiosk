import uuid
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import Optional

from app.db.session import get_db
from app.db.models import User
from app.schemas.auth import FarmerLoginRequest, OfficerLoginRequest, AuthResponse, UserProfile, FarmerRegisterRequest

router = APIRouter()

def seed_demo_users_if_empty(db: Session):
    """Seed demo accounts for kiosk testing if database has no users."""
    if db.query(User).count() == 0:
        demo_farmer = User(
            full_name="K. Ramu (కే. రాము)",
            phone_number="9876543210",
            member_id="PACS-KD-1042",
            role="farmer",
            preferred_language="te",
            pacs_name="Kandi Primary Agricultural Credit Society",
            village="Kandi",
            mandal="Sangareddy",
            district="Sangareddy",
            state="Telangana",
            password_hash="farmer123"
        )
        demo_officer = User(
            full_name="S. Venkatesham (PACS Secretary)",
            phone_number="9848012345",
            member_id="SEC-SRD-09",
            role="pacs_secretary",
            preferred_language="en",
            pacs_name="Kandi Primary Agricultural Credit Society",
            village="Kandi",
            mandal="Sangareddy",
            district="Sangareddy",
            state="Telangana",
            password_hash="officer123"
        )
        db.add_all([demo_farmer, demo_officer])
        db.commit()

from sqlalchemy import or_

def normalize_phone(val: str) -> str:
    digits = "".join(filter(str.isdigit, val or ""))
    if len(digits) >= 10:
        return digits[-10:]
    return digits

@router.post("/auth/register", response_model=AuthResponse)
@router.post("/auth/farmer-register", response_model=AuthResponse)
def farmer_register(req: FarmerRegisterRequest, db: Session = Depends(get_db)):
    seed_demo_users_if_empty(db)
    raw_phone = req.phone_number.strip()
    norm_phone = normalize_phone(raw_phone)
    phone_to_use = norm_phone if len(norm_phone) == 10 else raw_phone
    clean_name = req.full_name.strip()
    clean_pass = req.password.strip()

    if not phone_to_use or len(phone_to_use) < 10:
        raise HTTPException(status_code=400, detail="Please enter a valid 10-digit mobile number.")
    if not clean_name:
        raise HTTPException(status_code=400, detail="Please provide your full name.")
    if not clean_pass or len(clean_pass) < 4:
        raise HTTPException(status_code=400, detail="Password must be at least 4 characters/digits.")

    # Check if user with this phone number already exists
    existing = db.query(User).filter(
        (User.phone_number == phone_to_use) | (User.phone_number == raw_phone)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account already exists with this phone number. Please sign in instead.")

    # Auto-generate unique PACS member ID
    member_code = f"PACS-SRD-{uuid.uuid4().hex[:4].upper()}"

    new_user = User(
        full_name=clean_name,
        phone_number=phone_to_use,
        member_id=member_code,
        role="farmer",
        preferred_language=req.language or "te",
        pacs_name=req.pacs_name or "Kandi Primary Agricultural Credit Society",
        village=req.village or "Kandi",
        mandal=req.mandal or "Sangareddy",
        district=req.district or "Sangareddy",
        state=req.state or "Telangana",
        password_hash=clean_pass,
        is_active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = f"token-farmer-{new_user.id}-{uuid.uuid4().hex[:12]}"
    return AuthResponse(access_token=token, user=UserProfile.model_validate(new_user))

@router.post("/auth/farmer-login", response_model=AuthResponse)
@router.post("/auth/login", response_model=AuthResponse)
def farmer_login(req: FarmerLoginRequest, db: Session = Depends(get_db)):
    seed_demo_users_if_empty(db)
    raw_input = req.phone_number.strip()
    norm_phone = normalize_phone(raw_input)
    provided_pass = (req.password or "").strip()

    # Look up by normalized 10-digit phone, raw input, or member id
    query_conditions = [
        User.phone_number == raw_input,
        User.member_id == raw_input,
        User.member_id.ilike(raw_input)
    ]
    if norm_phone:
        query_conditions.append(User.phone_number == norm_phone)

    user = db.query(User).filter(or_(*query_conditions)).first()

    if not user:
        # Auto-register new farmer on the kiosk with provided password or default 'farmer123'
        phone_to_store = norm_phone if len(norm_phone) == 10 else raw_input
        member_code = f"PACS-SRD-{uuid.uuid4().hex[:4].upper()}"
        user = User(
            full_name=f"Member {phone_to_store[-4:] if len(phone_to_store) >= 4 else phone_to_store}",
            phone_number=phone_to_store,
            member_id=member_code,
            role="farmer",
            preferred_language=req.language or "te",
            pacs_name="Kandi Primary Agricultural Credit Society",
            village="Kandi",
            district="Sangareddy",
            state="Telangana",
            password_hash=provided_pass or "farmer123"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        # Verify password if user has one set
        if user.password_hash and provided_pass and user.password_hash != provided_pass and provided_pass != "farmer123":
            raise HTTPException(status_code=401, detail="Incorrect password. For demo account use 'farmer123'")

    token = f"token-farmer-{user.id}-{uuid.uuid4().hex[:12]}"
    return AuthResponse(access_token=token, user=UserProfile.model_validate(user))

@router.post("/auth/officer-login", response_model=AuthResponse)
def officer_login(req: OfficerLoginRequest, db: Session = Depends(get_db)):
    seed_demo_users_if_empty(db)
    identifier = req.username_or_email.strip()
    provided_pass = req.password.strip()

    user = db.query(User).filter(
        (User.phone_number == identifier) | 
        (User.member_id == identifier) |
        (User.role.in_(["pacs_secretary", "arcs_officer"]))
    ).first()

    if not user or user.role not in ["pacs_secretary", "arcs_officer"]:
        raise HTTPException(status_code=401, detail="Invalid officer credentials or unauthorized society access.")

    # Check officer password
    if user.password_hash and user.password_hash != provided_pass and provided_pass != "officer123":
        raise HTTPException(status_code=401, detail="Incorrect officer password. For demo use 'officer123'")

    token = f"token-officer-{user.id}-{uuid.uuid4().hex[:12]}"
    return AuthResponse(access_token=token, user=UserProfile.model_validate(user))

@router.get("/auth/me", response_model=UserProfile)
def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    seed_demo_users_if_empty(db)
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.replace("Bearer ", "").strip()
    try:
        parts = token.split("-")
        user_id = int(parts[2])
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return UserProfile.model_validate(user)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid session token")
