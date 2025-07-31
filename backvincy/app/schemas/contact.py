# app/schemas/contact.py
from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime
from typing import Optional

class ContactBase(BaseModel):
    email: EmailStr
    phone: Optional[str] = None
    address: Optional[str] = None
    office_hours: Optional[str] = None
    support_email: Optional[EmailStr] = None

class ContactCreate(ContactBase):
    pass

class ContactUpdate(ContactBase):
    pass

class ContactOut(ContactBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True
