from app.core.security import get_current_user
from app.db.base import get_db
from app.models import User
from app.schemas.user import UserOut, UserUpdate
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import require_role, get_current_user
from app.models.user import UserRole, UserStatus
from sqlalchemy.orm import Session
from uuid import UUID
from app.crud.user import (
    get_user_by_id, list_users, update_user, delete_user_and_related
)
from app.schemas.live_session import LiveSessionOut
from app.crud.live_session import get_all_live_sessions, get_live_session
from fastapi import Query
from fastapi.responses import StreamingResponse
import csv
import io
from datetime import datetime
from app.services.email_service import send_user_approved_email, send_user_rejected_email
import logging

logger = logging.getLogger(__name__)

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
    # Get the current user before updating to check status change
    current_user = get_user_by_id(db, user_id)
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    old_status = current_user.user_status
    
    data = payload.dict(exclude_unset=True)

    # If front-end sends {"status": "Inactive"}, map it to the model's user_status field
    if "status" in data:
        data["user_status"] = data.pop("status")

    data["updated_by"] = admin.email
    updated = update_user(db, user_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Send email notification if status changed
    new_status = updated.user_status
    logger.info(f"Status check - Old: {old_status}, New: {new_status}, Changed: {old_status != new_status}")
    
    if old_status != new_status:
        try:
            user_name = updated.full_name or updated.email
            logger.info(f"Preparing to send email to {updated.email} (status changed from {old_status} to {new_status})")
            
            # If changed from Pending/Inactive to Active - send approval email
            if (old_status in [UserStatus.pending, UserStatus.inactive]) and new_status == UserStatus.active:
                send_user_approved_email(updated.email, user_name)
                logger.info(f"✅ Successfully sent approval email to {updated.email}")
            
            # If changed from Active/Pending to Inactive - send rejection email
            elif (old_status in [UserStatus.active, UserStatus.pending]) and new_status == UserStatus.inactive:
                send_user_rejected_email(updated.email, user_name)
                logger.info(f"✅ Successfully sent deactivation email to {updated.email}")
            else:
                logger.info(f"ℹ️ Status changed but no email sent (from {old_status} to {new_status})")
        except Exception as e:
            # Log error but don't fail the update
            logger.error(f"❌ Failed to send status change email: {str(e)}")
    
    return updated

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[admin_dep])
def admin_delete_user(user_id: UUID, db: Session = Depends(get_db)):
    success = delete_user_and_related(db, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return


@router.get("/export/csv", dependencies=[admin_dep])
def export_users_csv(db: Session = Depends(get_db)):
    """
    Export all users to CSV file for admin analysis and bulk email
    """
    users = list_users(db, skip=0, limit=10000)  # Get all users
    
    # Create CSV in memory
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write header
    writer.writerow([
        'ID',
        'Email',
        'Full Name',
        'Role',
        'Gender',
        'Date of Birth',
        'Nationality',
        'Phone',
        'City',
        'Country',
        'Occupation',
        'Marital Status',
        'Sleep Hours',
        'Exercise Frequency',
        'Smoking Status',
        'Alcohol Consumption',
        'User Status',
        'Created At',
        'Updated At',
        'Created By',
        'Updated By'
    ])
    
    # Write user data
    for user in users:
        writer.writerow([
            str(user.id),
            user.email,
            user.full_name or '',
            user.role.value if user.role else '',
            user.gender.value if user.gender else '',
            user.dob.strftime('%Y-%m-%d') if user.dob else '',
            user.nationality or '',
            user.phone or '',
            user.city or '',
            user.country or '',
            user.occupation or '',
            user.marital_status.value if user.marital_status else '',
            user.sleep_hours or '',
            user.exercise_frequency.value if user.exercise_frequency else '',
            user.smoking_status.value if user.smoking_status else '',
            user.alcohol_consumption.value if user.alcohol_consumption else '',
            user.user_status.value if user.user_status else '',
            user.created_at.strftime('%Y-%m-%d %H:%M:%S') if user.created_at else '',
            user.updated_at.strftime('%Y-%m-%d %H:%M:%S') if user.updated_at else '',
            user.created_by or '',
            user.updated_by or ''
        ])
    
    # Prepare response
    output.seek(0)
    filename = f"users_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename={filename}"
        }
    )