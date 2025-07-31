# app/crud/contact.py
from sqlalchemy.orm import Session
from app.models.contact import Contact
from app.schemas.contact import ContactCreate, ContactUpdate
from uuid import UUID
from typing import Optional

def create_contact(db: Session, contact: ContactCreate) -> Contact:
    db_contact = Contact(**contact.dict())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact

def get_contact(db: Session, contact_id: UUID) -> Optional[Contact]:
    return db.query(Contact).filter(Contact.id == contact_id).first()

def get_latest_contact(db: Session) -> Optional[Contact]:
    """Get the latest contact information for public display"""
    return db.query(Contact).order_by(Contact.created_at.desc()).first()

def update_contact(db: Session, contact_id: UUID, contact_update: ContactUpdate) -> Optional[Contact]:
    db_contact = get_contact(db, contact_id)
    if db_contact:
        for key, value in contact_update.dict(exclude_unset=True).items():
            setattr(db_contact, key, value)
        db.commit()
        db.refresh(db_contact)
    return db_contact

def delete_contact(db: Session, contact_id: UUID) -> bool:
    db_contact = get_contact(db, contact_id)
    if db_contact:
        db.delete(db_contact)
        db.commit()
        return True
    return False
