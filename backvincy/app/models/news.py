# app/models/news.py
from sqlalchemy import Column, String, Text, Date, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid

from app.db.base import Base

class News(Base):
    __tablename__ = "news"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    summary = Column(String(500), nullable=False)
    content = Column(Text, nullable=False)
    image_url = Column(String(500))
    publish_date = Column(Date, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
