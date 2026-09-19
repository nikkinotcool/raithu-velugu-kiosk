import uuid
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.db.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String(20), unique=True, index=True, nullable=True)
    member_id = Column(String(50), unique=True, index=True, nullable=True)
    full_name = Column(String(100), nullable=False)
    role = Column(String(30), default="farmer")  # "farmer", "pacs_member", "pacs_secretary", "arcs_officer"
    preferred_language = Column(String(10), default="te")
    pacs_name = Column(String(150), default="Kandi Primary Agricultural Credit Society")
    village = Column(String(100), default="Kandi")
    mandal = Column(String(100), default="Sangareddy")
    district = Column(String(100), default="Sangareddy")
    state = Column(String(100), default="Telangana")
    password_hash = Column(String(200), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    conversations = relationship("Conversation", back_populates="user")
    grievances = relationship("Grievance", back_populates="user")


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100), unique=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    language = Column(String(10), default="en")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=False)
    role = Column(String(20), nullable=False)  # "user" or "assistant"
    content = Column(Text, nullable=False)
    intent = Column(String(50), nullable=True)
    sources_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    conversation = relationship("Conversation", back_populates="messages")


class Grievance(Base):
    __tablename__ = "grievances"

    id = Column(Integer, primary_key=True, index=True)
    tracking_id = Column(String(50), unique=True, index=True, nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(50), default="Submitted")  # Submitted, Under ARCS Review, In Investigation, Resolved
    routed_to = Column(String(150), default="Assistant Registrar of Cooperative Societies (ARCS)")
    complainant_name = Column(String(100), nullable=True, default="Anonymous Farmer")
    complainant_phone = Column(String(20), nullable=True)
    pacs_name = Column(String(150), nullable=True, default="Kandi PACS")
    district = Column(String(100), nullable=True, default="Sangareddy")
    state = Column(String(100), nullable=True, default="Telangana")
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="grievances")
