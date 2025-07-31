# app/schemas/news.py
from pydantic import BaseModel
from uuid import UUID
from datetime import date, datetime
from typing import Optional

class NewsBase(BaseModel):
    title: str
    summary: str
    content: str
    image_url: Optional[str]
    publish_date: date

class NewsCreate(NewsBase):
    pass

class NewsUpdate(NewsBase):
    pass

class NewsOut(NewsBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True
