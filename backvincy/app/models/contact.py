# app/models/contact.py
from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid

from app.db.base import Base

class Contact(Base):
    __tablename__ = "contact"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    address = Column(Text, nullable=True)
    office_hours = Column(String(255), nullable=True)
    support_email = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
