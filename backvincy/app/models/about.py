# app/models/about.py
from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid

from app.db.base import Base

class About(Base):
    __tablename__ = "about"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    subtitle = Column(String(500), nullable=True)
    image_url = Column(String(500), nullable=True)
    heading = Column(String(255), nullable=True)
    content = Column(Text, nullable=True)
    heading_2 = Column(String(255), nullable=True)
    content_2 = Column(Text, nullable=True)
    image_url_2 = Column(String(500), nullable=True)
    team_members = Column(Text, nullable=True)
    mission = Column(Text, nullable=True)
    vision = Column(Text, nullable=True)
    description = Column(Text, nullable=False)
    team_info = Column(Text, nullable=True)
    company_history = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
