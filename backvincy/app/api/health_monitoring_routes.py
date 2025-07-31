from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from .. import models, schemas

from app.db.base import get_db
from app.core.security import get_current_user
from app.models import User
from app.crud import health_monitoring as crud
from app.schemas import (
    BiofeedbackCreate, BiofeedbackUpdate, BiofeedbackOut,
    BurnProgressCreate, BurnProgressUpdate, BurnProgressOut,
    BrainMonitoringCreate, BrainMonitoringUpdate, BrainMonitoringOut,
    HeartBrainSynchronicityCreate, HeartBrainSynchronicityUpdate, HeartBrainSynchronicityOut,
)

router = APIRouter(prefix="/health-monitoring", tags=["Health Monitoring"])

# === BIOFEEDBACK ===
@router.post("/biofeedback", response_model=BiofeedbackOut)
def create_biofeedback(data: BiofeedbackCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return crud.create_biofeedback(db, data)

@router.get("/biofeedback/{id}", response_model=BiofeedbackOut)
def get_biofeedback(id: UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    obj = crud.get_biofeedback(db, id)
    if not obj:
        raise HTTPException(status_code=404, detail="Biofeedback not found")
    return obj

@router.get(
    "/biofeedback",
    response_model=List[schemas.BiofeedbackOut],
    summary="List Biofeedback entries for this user",
)
def list_biofeedback(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return (
        db.query(models.Biofeedback)
        .filter(models.Biofeedback.user_email == current_user.email)
        .order_by(models.Biofeedback.created_at.desc())
        .all()
    )

@router.put("/biofeedback/{id}", response_model=BiofeedbackOut)
def update_biofeedback(id: UUID, update: BiofeedbackUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return crud.update_biofeedback(db, id, update)

@router.delete("/biofeedback/{id}")
def delete_biofeedback(id: UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    success = crud.delete_biofeedback(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="Biofeedback not found")
    return {"detail": "Biofeedback deleted successfully"}


# === BURN PROGRESS ===
@router.post("/burn-progress", response_model=BurnProgressOut)
def create_burn_progress(data: BurnProgressCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return crud.create_burn_progress(db, data)

@router.get("/burn-progress/{id}", response_model=BurnProgressOut)
def get_burn_progress(id: UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    obj = crud.get_burn_progress(db, id)
    if not obj:
        raise HTTPException(status_code=404, detail="BurnProgress not found")
    return obj

@router.get(
    "/burn-progress",
    response_model=List[schemas.BurnProgressOut],
    summary="List Burn Progress entries for this user",
)
def list_burn_progress(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return (
        db.query(models.BurnProgress)
        .filter(models.BurnProgress.user_email == current_user.email)
        .order_by(models.BurnProgress.created_at.desc())
        .all()
    )

@router.put("/burn-progress/{id}", response_model=BurnProgressOut)
def update_burn_progress(id: UUID, update: BurnProgressUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return crud.update_burn_progress(db, id, update)

@router.delete("/burn-progress/{id}")
def delete_burn_progress(id: UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    success = crud.delete_burn_progress(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="BurnProgress not found")
    return {"detail": "BurnProgress deleted successfully"}


# === BRAIN MONITORING ===
@router.post("/brain-monitoring", response_model=BrainMonitoringOut)
def create_brain_monitoring(data: BrainMonitoringCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return crud.create_brain_monitoring(db, data)

@router.get("/brain-monitoring/{id}", response_model=BrainMonitoringOut)
def get_brain_monitoring(id: UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    obj = crud.get_brain_monitoring(db, id)
    if not obj:
        raise HTTPException(status_code=404, detail="BrainMonitoring not found")
    return obj

@router.get(
    "/brain-monitoring",
    response_model=List[schemas.BrainMonitoringOut],
    summary="List Brain monitoring entries for this user",
)
def list_burn_progress(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return (
        db.query(models.BrainMonitoring)
        .filter(models.BrainMonitoring.user_email == current_user.email)
        .order_by(models.BrainMonitoring.created_at.desc())
        .all()
    )

@router.put("/brain-monitoring/{id}", response_model=BrainMonitoringOut)
def update_brain_monitoring(id: UUID, update: BrainMonitoringUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return crud.update_brain_monitoring(db, id, update)

@router.delete("/brain-monitoring/{id}")
def delete_brain_monitoring(id: UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    success = crud.delete_brain_monitoring(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="BrainMonitoring not found")
    return {"detail": "BrainMonitoring deleted successfully"}


# === HEART-BRAIN SYNCHRONICITY ===
@router.post("/heart-brain-synchronicity", response_model=HeartBrainSynchronicityOut)
def create_heart_brain(data: HeartBrainSynchronicityCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return crud.create_heart_brain_synchronicity(db, data)

@router.get("/heart-brain-synchronicity/{id}", response_model=HeartBrainSynchronicityOut)
def get_heart_brain(id: UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    obj = crud.get_heart_brain_synchronicity(db, id)
    if not obj:
        raise HTTPException(status_code=404, detail="HeartBrainSynchronicity not found")
    return obj

@router.get(
    "/heart-brain-synchronicity",
    response_model=List[schemas.HeartBrainSynchronicityOut],
    summary="List Heart Brain synchronicities entries for this user",
)
def list_burn_progress(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return (
        db.query(models.HeartBrainSynchronicity)
        .filter(models.HeartBrainSynchronicity.user_email == current_user.email)
        .order_by(models.HeartBrainSynchronicity.created_at.desc())
        .all()
    )

@router.put("/heart-brain-synchronicity/{id}", response_model=HeartBrainSynchronicityOut)
def update_heart_brain(id: UUID, update: HeartBrainSynchronicityUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return crud.update_heart_brain_synchronicity(db, id, update)

@router.delete("/heart-brain-synchronicity/{id}")
def delete_heart_brain(id: UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    success = crud.delete_heart_brain_synchronicity(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="HeartBrainSynchronicity not found")
    return {"detail": "HeartBrainSynchronicity deleted successfully"}
