# app/api/admin_live_session.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi import Body
from uuid import UUID
from typing import List

from app.core.security import require_role
from app.db.base import get_db
from app.schemas.live_session import (
    LiveSessionCreate,
    LiveSessionUpdate,
    LiveSessionOut
)
from app.crud.live_session import (
    create_live_session,
    get_live_session,
    get_all_live_sessions,
    update_live_session,
    delete_live_session
)

router = APIRouter(
    prefix="/admin/live-session",
    tags=["admin-live-session"],
    dependencies=[Depends(require_role(["Admin"]))]
)

@router.post("/", response_model=LiveSessionOut)
def admin_create_live_session(payload: LiveSessionCreate, db: Session = Depends(get_db)):
    return create_live_session(db, payload)

@router.get("/", response_model=List[LiveSessionOut])
def admin_list_live_sessions(db: Session = Depends(get_db)):
    return get_all_live_sessions(db)

@router.get("/{live_session_id}", response_model=LiveSessionOut)
def admin_get_live_session(live_session_id: UUID, db: Session = Depends(get_db)):
    session = get_live_session(db, live_session_id)
    if not session:
        raise HTTPException(status_code=404, detail="LiveSession not found")
    return session

@router.put("/{live_session_id}", response_model=LiveSessionOut)
def admin_update_live_session(
    live_session_id: UUID,
    payload: LiveSessionUpdate,
    db: Session = Depends(get_db)
):
    session = update_live_session(db, live_session_id, payload)
    if not session:
        raise HTTPException(status_code=404, detail="LiveSession not found")
    return session

@router.delete("/{live_session_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_live_session(live_session_id: UUID, db: Session = Depends(get_db)):
    if not delete_live_session(db, live_session_id):
        raise HTTPException(status_code=404, detail="LiveSession not found")


@router.patch("/{live_session_id}/livestatus", response_model=LiveSessionOut)
def toggle_live_status(
    live_session_id: UUID,
    livestatus: bool = Body(..., embed=True),
    db: Session = Depends(get_db)
):
    session = get_live_session(db, live_session_id)
    if not session:
        raise HTTPException(status_code=404, detail="LiveSession not found")
    session.livestatus = livestatus
    db.commit()
    db.refresh(session)
    return session