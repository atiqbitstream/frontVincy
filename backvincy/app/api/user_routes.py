from app.core.security import get_current_user
from app.db.base import get_db
from app.models import User
from app.schemas.user import UserOut, UserUpdate
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import require_role, get_current_user
from app.models.user import UserRole
from sqlalchemy.orm import Session
from uuid import UUID
from app.crud.user import (
    get_user_by_id, list_users, update_user, delete_user_and_related
)
from app.schemas.live_session import LiveSessionOut
from app.crud.live_session import get_all_live_sessions, get_live_session
from fastapi import Query

# IMPORTANT: Make sure there's no default dependencies here that would restrict access
router = APIRouter(tags=["users"])


@router.get("/me", response_model=UserOut)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user


# Place these BEFORE any "/{user_id}" or similar catch-all routes

@router.get("/live-sessions", response_model=list[LiveSessionOut])
async def list_live_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000)
):
    """
    List live sessions for general users.
    """
    return get_all_live_sessions(db, skip=skip, limit=limit)

@router.get("/live-sessions/{live_session_id}", response_model=LiveSessionOut)
async def get_live_session_detail(
    live_session_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get live session detail by ID for general users.
    """
    session = get_live_session(db, live_session_id)
    if not session:
        raise HTTPException(status_code=404, detail="LiveSession not found")
    return session


# --- Admin-only endpoints ---
admin_dep = Depends(require_role([UserRole.admin]))

@router.get("", response_model=list[UserOut], dependencies=[admin_dep])
def admin_list_users(db: Session = Depends(get_db), skip: int = 0, limit: int = 100):
    return list_users(db, skip, limit)

@router.get("/{user_id}", response_model=UserOut, dependencies=[admin_dep])
def admin_get_user(user_id: UUID, db: Session = Depends(get_db)):
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{user_id}", response_model=UserOut, dependencies=[admin_dep])
def admin_update_user(
    user_id: UUID,
    payload: UserUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_user),
):
    data = payload.dict(exclude_unset=True)

    # If front-end sends {"status": "Inactive"}, map it to the model's user_status field
    if "status" in data:
        data["user_status"] = data.pop("status")

    data["updated_by"] = admin.email
    updated = update_user(db, user_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    return updated

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[admin_dep])
def admin_delete_user(user_id: UUID, db: Session = Depends(get_db)):
    success = delete_user_and_related(db, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return