# app/models/live_session.py
from sqlalchemy import Column, String, Text, DateTime, Integer,Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid

from app.db.base import Base

class LiveSession(Base):
    __tablename__ = "live_session"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_title = Column(String(255), nullable=False)
    host = Column(String(255), nullable=False)
    description = Column(Text)
    date_time = Column(DateTime, nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    youtube_link = Column(String(500))
    livestatus = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
