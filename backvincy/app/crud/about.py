# app/crud/about.py
from sqlalchemy.orm import Session
from app.models.about import About
from app.schemas.about import AboutCreate, AboutUpdate
from uuid import UUID
from typing import Optional

def create_about(db: Session, about: AboutCreate) -> About:
    db_about = About(**about.dict())
    db.add(db_about)
    db.commit()
    db.refresh(db_about)
    return db_about

def get_about(db: Session, about_id: UUID) -> Optional[About]:
    return db.query(About).filter(About.id == about_id).first()

def get_latest_about(db: Session) -> Optional[About]:
    """Get the latest about information for public display"""
    return db.query(About).order_by(About.created_at.desc()).first()

def update_about(db: Session, about_id: UUID, about_update: AboutUpdate) -> Optional[About]:
    db_about = get_about(db, about_id)
    if db_about:
        for key, value in about_update.dict(exclude_unset=True).items():
            setattr(db_about, key, value)
        db.commit()
        db.refresh(db_about)
    return db_about

def delete_about(db: Session, about_id: UUID) -> bool:
    db_about = get_about(db, about_id)
    if db_about:
        db.delete(db_about)
        db.commit()
        return True
    return False
