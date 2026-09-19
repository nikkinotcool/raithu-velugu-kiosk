from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class ChatRequest(BaseModel):
    query: str = Field(..., description="User query text or transcribed speech")
    language: str = Field(default="en", description="ISO language code: en, te, hi, kn, ta, mr")
    session_id: Optional[str] = Field(default="default-kiosk-session", description="Session identifier")
    user_role: Optional[str] = Field(default="farmer", description="Role: farmer, pacs_member, pacs_secretary, general")

class SourceCitation(BaseModel):
    title: str
    section: str
    excerpt: str
    act_or_scheme: str

class GrievanceTicketBrief(BaseModel):
    tracking_id: str
    category: str
    status: str
    routed_to: str
    created_at: str

class ChatResponse(BaseModel):
    response: str
    sources: List[SourceCitation] = []
    language: str
    session_id: str
    intent: str  # "information_query", "grievance_complaint", "legal_inquiry", "scheme_application"
    grievance_ticket: Optional[GrievanceTicketBrief] = None
    suggested_actions: List[str] = []
