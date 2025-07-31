# app/api/admin_health_monitoring.py

from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import require_role
from app.db.base import get_db
from app.crud.health_monitoring import (
    get_biofeedbacks_by_user_email,
    get_biofeedback,
    update_biofeedback,
    delete_biofeedback,
    get_burn_progresses_by_user_email,
    get_burn_progress,
    update_burn_progress,
    delete_burn_progress,
    get_brain_monitorings_by_user_email,
    get_brain_monitoring,
    update_brain_monitoring,
    delete_brain_monitoring,
    get_heart_brain_synchronicities_by_user_email,
    get_heart_brain_synchronicity,
    update_heart_brain_synchronicity,
    delete_heart_brain_synchronicity,
)
from app.schemas.health_monitoring import (
    BiofeedbackOut, BiofeedbackUpdate,
    BurnProgressOut, BurnProgressUpdate,
    BrainMonitoringOut, BrainMonitoringUpdate,
    HeartBrainSynchronicityOut, HeartBrainSynchronicityUpdate,
)

router = APIRouter(
    prefix="/admin/health-monitoring",
    tags=["admin-health-monitoring"],
    dependencies=[Depends(require_role(["Admin"]))],
)

# === BIOFEEDBACK ===
@router.get(
    "/users/{user_email}/biofeedback",
    response_model=List[BiofeedbackOut],
    summary="Admin: List all Biofeedback entries for a user",
)
def admin_list_biofeedback(user_email: str, db: Session = Depends(get_db)):
    return get_biofeedbacks_by_user_email(db, user_email)

@router.get(
    "/biofeedback/{bio_id}",
    response_model=BiofeedbackOut,
    summary="Admin: Get a specific Biofeedback entry",
)
def admin_get_biofeedback(bio_id: UUID, db: Session = Depends(get_db)):
    obj = get_biofeedback(db, bio_id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Biofeedback not found")
    return obj

@router.put(
    "/biofeedback/{bio_id}",
    response_model=BiofeedbackOut,
    summary="Admin: Update any Biofeedback entry",
)
def admin_update_biofeedback(
    bio_id: UUID,
    payload: BiofeedbackUpdate,
    db: Session = Depends(get_db),
):
    updated = update_biofeedback(db, bio_id, payload)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Biofeedback not found")
    return updated

@router.delete(
    "/biofeedback/{bio_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Admin: Delete any Biofeedback entry",
)
def admin_delete_biofeedback(bio_id: UUID, db: Session = Depends(get_db)):
    if not delete_biofeedback(db, bio_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Biofeedback not found")


# === BURN PROGRESS ===
@router.get(
    "/users/{user_email}/burn-progress",
    response_model=List[BurnProgressOut],
    summary="Admin: List all BurnProgress entries for a user",
)
def admin_list_burn_progress(user_email: str, db: Session = Depends(get_db)):
    return get_burn_progresses_by_user_email(db, user_email)

@router.get(
    "/burn-progress/{bp_id}",
    response_model=BurnProgressOut,
    summary="Admin: Get a specific BurnProgress entry",
)
def admin_get_burn_progress(bp_id: UUID, db: Session = Depends(get_db)):
    obj = get_burn_progress(db, bp_id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="BurnProgress not found")
    return obj

@router.put(
    "/burn-progress/{bp_id}",
    response_model=BurnProgressOut,
    summary="Admin: Update any BurnProgress entry",
)
def admin_update_burn_progress(
    bp_id: UUID,
    payload: BurnProgressUpdate,
    db: Session = Depends(get_db),
):
    updated = update_burn_progress(db, bp_id, payload)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="BurnProgress not found")
    return updated

@router.delete(
    "/burn-progress/{bp_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Admin: Delete any BurnProgress entry",
)
def admin_delete_burn_progress(bp_id: UUID, db: Session = Depends(get_db)):
    if not delete_burn_progress(db, bp_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="BurnProgress not found")


# === BRAIN MONITORING ===
@router.get(
    "/users/{user_email}/brain-monitoring",
    response_model=List[BrainMonitoringOut],
    summary="Admin: List all BrainMonitoring entries for a user",
)
def admin_list_brain_monitoring(user_email: str, db: Session = Depends(get_db)):
    return get_brain_monitorings_by_user_email(db, user_email)

@router.get(
    "/brain-monitoring/{bm_id}",
    response_model=BrainMonitoringOut,
    summary="Admin: Get a specific BrainMonitoring entry",
)
def admin_get_brain_monitoring(bm_id: UUID, db: Session = Depends(get_db)):
    obj = get_brain_monitoring(db, bm_id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="BrainMonitoring not found")
    return obj

@router.put(
    "/brain-monitoring/{bm_id}",
    response_model=BrainMonitoringOut,
    summary="Admin: Update any BrainMonitoring entry",
)
def admin_update_brain_monitoring(
    bm_id: UUID,
    payload: BrainMonitoringUpdate,
    db: Session = Depends(get_db),
):
    updated = update_brain_monitoring(db, bm_id, payload)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="BrainMonitoring not found")
    return updated

@router.delete(
    "/brain-monitoring/{bm_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Admin: Delete any BrainMonitoring entry",
)
def admin_delete_brain_monitoring(bm_id: UUID, db: Session = Depends(get_db)):
    if not delete_brain_monitoring(db, bm_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="BrainMonitoring not found")


# === HEART–BRAIN SYNCHRONICITY ===
@router.get(
    "/users/{user_email}/heart-brain-synchronicity",
    response_model=List[HeartBrainSynchronicityOut],
    summary="Admin: List all HeartBrainSynchronicity entries for a user",
)
def admin_list_heart_brain(user_email: str, db: Session = Depends(get_db)):
    return get_heart_brain_synchronicities_by_user_email(db, user_email)

@router.get(
    "/heart-brain-synchronicity/{hb_id}",
    response_model=HeartBrainSynchronicityOut,
    summary="Admin: Get a specific HeartBrainSynchronicity entry",
)
def admin_get_heart_brain(hb_id: UUID, db: Session = Depends(get_db)):
    obj = get_heart_brain_synchronicity(db, hb_id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="HeartBrainSynchronicity not found")
    return obj

@router.put(
    "/heart-brain-synchronicity/{hb_id}",
    response_model=HeartBrainSynchronicityOut,
    summary="Admin: Update any HeartBrainSynchronicity entry",
)
def admin_update_heart_brain(
    hb_id: UUID,
    payload: HeartBrainSynchronicityUpdate,
    db: Session = Depends(get_db),
):
    updated = update_heart_brain_synchronicity(db, hb_id, payload)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="HeartBrainSynchronicity not found")
    return updated

@router.delete(
    "/heart-brain-synchronicity/{hb_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Admin: Delete any HeartBrainSynchronicity entry",
)
def admin_delete_heart_brain(hb_id: UUID, db: Session = Depends(get_db)):
    if not delete_heart_brain_synchronicity(db, hb_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="HeartBrainSynchronicity not found")
