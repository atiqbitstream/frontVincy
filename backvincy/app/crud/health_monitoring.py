from uuid import UUID
from typing import List, Optional

from sqlalchemy.orm import Session

from app.models import Biofeedback, BurnProgress, BrainMonitoring, HeartBrainSynchronicity
from app.schemas.health_monitoring import (
    BiofeedbackCreate, BiofeedbackUpdate,
    BurnProgressCreate, BurnProgressUpdate,
    BrainMonitoringCreate, BrainMonitoringUpdate,
    HeartBrainSynchronicityCreate, HeartBrainSynchronicityUpdate
)


# Biofeedback CRUD operations
def create_biofeedback(db: Session, biofeedback: BiofeedbackCreate) -> Biofeedback:
    db_biofeedback = Biofeedback(
        heart_rate=biofeedback.heart_rate,
        heart_rate_variability=biofeedback.heart_rate_variability,
        electromyography=biofeedback.electromyography,
        electrodermal_activity=biofeedback.electrodermal_activity,
        respiration_rate=biofeedback.respiration_rate,
        blood_pressure=biofeedback.blood_pressure,
        temperature=biofeedback.temperature,
        brainwave_activity=biofeedback.brainwave_activity,
        oxygen_saturation=biofeedback.oxygen_saturation,
        blood_glucose_levels=biofeedback.blood_glucose_levels,
        galvanic_skin_response=biofeedback.galvanic_skin_response,
        user_email=biofeedback.user_email,
        created_by=biofeedback.created_by
    )
    db.add(db_biofeedback)
    db.commit()
    db.refresh(db_biofeedback)
    return db_biofeedback


def get_biofeedback(db: Session, biofeedback_id: UUID) -> Optional[Biofeedback]:
    return db.query(Biofeedback).filter(Biofeedback.id == biofeedback_id).first()


def get_biofeedback_by_user_email(db: Session, user_email: str) -> Optional[Biofeedback]:
    return db.query(Biofeedback).filter(Biofeedback.user_email == user_email).order_by(Biofeedback.created_at.desc()).first()


def get_biofeedbacks_by_user_email(db: Session, user_email: str, skip: int = 0, limit: int = 100) -> List[Biofeedback]:
    return db.query(Biofeedback).filter(Biofeedback.user_email == user_email).order_by(Biofeedback.created_at.desc()).offset(skip).limit(limit).all()


def update_biofeedback(db: Session, biofeedback_id: UUID, biofeedback_update: BiofeedbackUpdate) -> Optional[Biofeedback]:
    db_biofeedback = get_biofeedback(db, biofeedback_id)
    if db_biofeedback:
        update_data = biofeedback_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_biofeedback, key, value)
        db.commit()
        db.refresh(db_biofeedback)
    return db_biofeedback


def delete_biofeedback(db: Session, biofeedback_id: UUID) -> bool:
    db_biofeedback = get_biofeedback(db, biofeedback_id)
    if db_biofeedback:
        db.delete(db_biofeedback)
        db.commit()
        return True
    return False


# BurnProgress CRUD operations
def create_burn_progress(db: Session, burn_progress: BurnProgressCreate) -> BurnProgress:
    db_burn_progress = BurnProgress(
        wound_size_depth=burn_progress.wound_size_depth,
        epithelialization=burn_progress.epithelialization,
        exudate_amount_type=burn_progress.exudate_amount_type,
        infection_indicators=burn_progress.infection_indicators,
        granulation_tissue=burn_progress.granulation_tissue,
        pain_levels=burn_progress.pain_levels,
        swelling_edema=burn_progress.swelling_edema,
        scarring=burn_progress.scarring,
        functional_recovery=burn_progress.functional_recovery,
        color_changes=burn_progress.color_changes,
        temperature_wound_site=burn_progress.temperature_wound_site,
        blood_flow_perfusion=burn_progress.blood_flow_perfusion,
        nutritional_status=burn_progress.nutritional_status,
        systemic_indicators=burn_progress.systemic_indicators,
        user_email=burn_progress.user_email,
        created_by=burn_progress.created_by
    )
    db.add(db_burn_progress)
    db.commit()
    db.refresh(db_burn_progress)
    return db_burn_progress


def get_burn_progress(db: Session, burn_progress_id: UUID) -> Optional[BurnProgress]:
    return db.query(BurnProgress).filter(BurnProgress.id == burn_progress_id).first()


def get_burn_progress_by_user_email(db: Session, user_email: str) -> Optional[BurnProgress]:
    return db.query(BurnProgress).filter(BurnProgress.user_email == user_email).order_by(BurnProgress.created_at.desc()).first()


def get_burn_progresses_by_user_email(db: Session, user_email: str, skip: int = 0, limit: int = 100) -> List[BurnProgress]:
    return db.query(BurnProgress).filter(BurnProgress.user_email == user_email).order_by(BurnProgress.created_at.desc()).offset(skip).limit(limit).all()


def update_burn_progress(db: Session, burn_progress_id: UUID, burn_progress_update: BurnProgressUpdate) -> Optional[BurnProgress]:
    db_burn_progress = get_burn_progress(db, burn_progress_id)
    if db_burn_progress:
        update_data = burn_progress_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_burn_progress, key, value)
        db.commit()
        db.refresh(db_burn_progress)
    return db_burn_progress


def delete_burn_progress(db: Session, burn_progress_id: UUID) -> bool:
    db_burn_progress = get_burn_progress(db, burn_progress_id)
    if db_burn_progress:
        db.delete(db_burn_progress)
        db.commit()
        return True
    return False


# BrainMonitoring CRUD operations
def create_brain_monitoring(db: Session, brain_monitoring: BrainMonitoringCreate) -> BrainMonitoring:
    db_brain_monitoring = BrainMonitoring(
        alpha_waves=brain_monitoring.alpha_waves,
        theta_waves=brain_monitoring.theta_waves,
        beta_waves=brain_monitoring.beta_waves,
        gamma_waves=brain_monitoring.gamma_waves,
        heart_rate=brain_monitoring.heart_rate,
        heart_rate_variability=brain_monitoring.heart_rate_variability,
        electromyography=brain_monitoring.electromyography,
        respiration_rate=brain_monitoring.respiration_rate,
        electrodermal_activity=brain_monitoring.electrodermal_activity,
        peripheral_skin_temperature=brain_monitoring.peripheral_skin_temperature,
        user_email=brain_monitoring.user_email,
        created_by=brain_monitoring.created_by
    )
    db.add(db_brain_monitoring)
    db.commit()
    db.refresh(db_brain_monitoring)
    return db_brain_monitoring


def get_brain_monitoring(db: Session, brain_monitoring_id: UUID) -> Optional[BrainMonitoring]:
    return db.query(BrainMonitoring).filter(BrainMonitoring.id == brain_monitoring_id).first()


def get_brain_monitoring_by_user_email(db: Session, user_email: str) -> Optional[BrainMonitoring]:
    return db.query(BrainMonitoring).filter(BrainMonitoring.user_email == user_email).order_by(BrainMonitoring.created_at.desc()).first()


def get_brain_monitorings_by_user_email(db: Session, user_email: str, skip: int = 0, limit: int = 100) -> List[BrainMonitoring]:
    return db.query(BrainMonitoring).filter(BrainMonitoring.user_email == user_email).order_by(BrainMonitoring.created_at.desc()).offset(skip).limit(limit).all()


def update_brain_monitoring(db: Session, brain_monitoring_id: UUID, brain_monitoring_update: BrainMonitoringUpdate) -> Optional[BrainMonitoring]:
    db_brain_monitoring = get_brain_monitoring(db, brain_monitoring_id)
    if db_brain_monitoring:
        update_data = brain_monitoring_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_brain_monitoring, key, value)
        db.commit()
        db.refresh(db_brain_monitoring)
    return db_brain_monitoring


def delete_brain_monitoring(db: Session, brain_monitoring_id: UUID) -> bool:
    db_brain_monitoring = get_brain_monitoring(db, brain_monitoring_id)
    if db_brain_monitoring:
        db.delete(db_brain_monitoring)
        db.commit()
        return True
    return False


# HeartBrainSynchronicity CRUD operations
def create_heart_brain_synchronicity(db: Session, heart_brain_synchronicity: HeartBrainSynchronicityCreate) -> HeartBrainSynchronicity:
    db_heart_brain_synchronicity = HeartBrainSynchronicity(
        heart_rate_variability=heart_brain_synchronicity.heart_rate_variability,
        alpha_waves=heart_brain_synchronicity.alpha_waves,
        respiratory_sinus_arrhythmia=heart_brain_synchronicity.respiratory_sinus_arrhythmia,
        coherence_ratio=heart_brain_synchronicity.coherence_ratio,
        brainwave_coherence=heart_brain_synchronicity.brainwave_coherence,
        blood_pressure_variability=heart_brain_synchronicity.blood_pressure_variability,
        electrodermal_activity=heart_brain_synchronicity.electrodermal_activity,
        breathing_patterns=heart_brain_synchronicity.breathing_patterns,
        subjective_measures=heart_brain_synchronicity.subjective_measures,
        user_email=heart_brain_synchronicity.user_email,
        created_by=heart_brain_synchronicity.created_by
    )
    db.add(db_heart_brain_synchronicity)
    db.commit()
    db.refresh(db_heart_brain_synchronicity)
    return db_heart_brain_synchronicity


def get_heart_brain_synchronicity(db: Session, heart_brain_synchronicity_id: UUID) -> Optional[HeartBrainSynchronicity]:
    return db.query(HeartBrainSynchronicity).filter(HeartBrainSynchronicity.id == heart_brain_synchronicity_id).first()


def get_heart_brain_synchronicity_by_user_email(db: Session, user_email: str) -> Optional[HeartBrainSynchronicity]:
    return db.query(HeartBrainSynchronicity).filter(HeartBrainSynchronicity.user_email == user_email).order_by(HeartBrainSynchronicity.created_at.desc()).first()


def get_heart_brain_synchronicities_by_user_email(db: Session, user_email: str, skip: int = 0, limit: int = 100) -> List[HeartBrainSynchronicity]:
    return db.query(HeartBrainSynchronicity).filter(HeartBrainSynchronicity.user_email == user_email).order_by(HeartBrainSynchronicity.created_at.desc()).offset(skip).limit(limit).all()


def update_heart_brain_synchronicity(db: Session, heart_brain_synchronicity_id: UUID, heart_brain_synchronicity_update: HeartBrainSynchronicityUpdate) -> Optional[HeartBrainSynchronicity]:
    db_heart_brain_synchronicity = get_heart_brain_synchronicity(db, heart_brain_synchronicity_id)
    if db_heart_brain_synchronicity:
        update_data = heart_brain_synchronicity_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_heart_brain_synchronicity, key, value)
        db.commit()
        db.refresh(db_heart_brain_synchronicity)
    return db_heart_brain_synchronicity


def delete_heart_brain_synchronicity(db: Session, heart_brain_synchronicity_id: UUID) -> bool:
    db_heart_brain_synchronicity = get_heart_brain_synchronicity(db, heart_brain_synchronicity_id)
    if db_heart_brain_synchronicity:
        db.delete(db_heart_brain_synchronicity)
        db.commit()
        return True
    return False