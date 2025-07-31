# app/crud/live_session.py

from uuid import UUID
from typing import List, Optional

from sqlalchemy.orm import Session
from app.models.live_session import LiveSession
from app.schemas.live_session import LiveSessionCreate, LiveSessionUpdate

def create_live_session(db: Session, data: LiveSessionCreate) -> LiveSession:
    db_live_session = LiveSession(**data.dict())
    db.add(db_live_session)
    db.commit()
    db.refresh(db_live_session)
    return db_live_session

def get_live_session(db: Session, live_session_id: UUID) -> Optional[LiveSession]:
    return db.query(LiveSession).filter(LiveSession.id == live_session_id).first()

def get_all_live_sessions(db: Session, skip: int = 0, limit: int = 100) -> List[LiveSession]:
    return (
        db.query(LiveSession)
        .order_by(LiveSession.date_time.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

def get_latest_live_session(db: Session) -> Optional[LiveSession]:
    """Get the latest live session for public display"""
    return (
        db.query(LiveSession)
        .order_by(LiveSession.date_time.desc())
        .first()
    )

def update_live_session(db: Session, live_session_id: UUID, data: LiveSessionUpdate) -> Optional[LiveSession]:
    db_live_session = get_live_session(db, live_session_id)
    if db_live_session:
        for key, value in data.dict(exclude_unset=True).items():
            setattr(db_live_session, key, value)
        db.commit()
        db.refresh(db_live_session)
    return db_live_session

def delete_live_session(db: Session, live_session_id: UUID) -> bool:
    db_live_session = get_live_session(db, live_session_id)
    if db_live_session:
        db.delete(db_live_session)
        db.commit()
        return True
    return False
