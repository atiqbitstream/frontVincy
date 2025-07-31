# app/schemas/about.py
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class AboutBase(BaseModel):
    title: str
    subtitle: Optional[str] = None
    image_url: Optional[str] = None
    heading: Optional[str] = None
    content: Optional[str] = None
    heading_2: Optional[str] = None
    content_2: Optional[str] = None
    image_url_2: Optional[str] = None
    team_members: Optional[str] = None
    mission: Optional[str] = None
    vision: Optional[str] = None
    description: str
    team_info: Optional[str] = None
    company_history: Optional[str] = None

class AboutCreate(AboutBase):
    pass

class AboutUpdate(AboutBase):
    pass

class AboutOut(AboutBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True
