from pydantic import BaseModel, Field
from typing import Optional

class FarmerLoginRequest(BaseModel):
    phone_number: str = Field(..., description="10-digit mobile number or PACS member ID")
    password: Optional[str] = Field(default="farmer123", description="Password or 4-digit PIN")
    member_id: Optional[str] = None
    language: Optional[str] = "te"

class OfficerLoginRequest(BaseModel):
    username_or_email: str
    password: str

class FarmerRegisterRequest(BaseModel):
    full_name: str = Field(..., description="Farmer full name")
    phone_number: str = Field(..., description="10-digit mobile number")
    password: str = Field(..., description="Password or PIN")
    language: Optional[str] = "te"
    pacs_name: Optional[str] = "Kandi Primary Agricultural Credit Society"
    village: Optional[str] = "Kandi"
    mandal: Optional[str] = "Sangareddy"
    district: Optional[str] = "Sangareddy"
    state: Optional[str] = "Telangana"

class UserProfile(BaseModel):
    id: int
    full_name: str
    phone_number: Optional[str] = None
    member_id: Optional[str] = None
    role: str
    preferred_language: str
    pacs_name: str
    village: str
    district: str
    state: str

    class Config:
        from_attributes = True

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfile
