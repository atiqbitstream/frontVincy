# app/schemas/live_session.py
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class LiveSessionBase(BaseModel):
    session_title: str
    host: str
    description: Optional[str]
    date_time: datetime
    duration_minutes: int
    youtube_link: Optional[str]
    livestatus: Optional[bool] = False 

class LiveSessionCreate(LiveSessionBase):
    pass

class LiveSessionUpdate(LiveSessionBase):
    pass

class LiveSessionOut(LiveSessionBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True
