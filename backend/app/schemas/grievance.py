from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class GrievanceCreate(BaseModel):
    category: str = Field(..., description="E.g., PMFBY Claim Rejection, PACS Loan Delay, Fertilizer Black Market, Vote Denied")
    description: str
    complainant_name: Optional[str] = "Anonymous Farmer"
    complainant_phone: Optional[str] = None
    pacs_name: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None

class GrievanceOut(BaseModel):
    id: int
    tracking_id: str
    category: str
    description: str
    complainant_name: Optional[str]
    complainant_phone: Optional[str]
    pacs_name: Optional[str]
    status: str
    routed_to: str
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class GrievanceStatusQuery(BaseModel):
    tracking_id: str
