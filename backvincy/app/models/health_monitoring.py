import uuid
from app.db.base import Base
from sqlalchemy import Column, DateTime, Float, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func


class Biofeedback(Base):
    __tablename__ = "biofeedbacks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    heart_rate = Column(Float, nullable=True)
    heart_rate_variability = Column(Float, nullable=True)
    electromyography = Column(Float, nullable=True)
    electrodermal_activity = Column(Float, nullable=True)
    respiration_rate = Column(Float, nullable=True)
    blood_pressure = Column(Float, nullable=True)
    temperature = Column(Float, nullable=True)
    brainwave_activity = Column(Float, nullable=True)
    oxygen_saturation = Column(Float, nullable=True)
    blood_glucose_levels = Column(Float, nullable=True)
    galvanic_skin_response = Column(Float, nullable=True)
    user_email = Column(String, ForeignKey("users.email"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_by = Column(String, nullable=True)
    updated_by = Column(String, nullable=True)


class BurnProgress(Base):
    __tablename__ = "burn_progresses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    wound_size_depth = Column(Float, nullable=True)
    epithelialization = Column(Float, nullable=True)
    exudate_amount_type = Column(Float, nullable=True)
    infection_indicators = Column(Float, nullable=True)
    granulation_tissue = Column(Float, nullable=True)
    pain_levels = Column(Float, nullable=True)
    swelling_edema = Column(Float, nullable=True)
    scarring = Column(Float, nullable=True)
    functional_recovery = Column(Float, nullable=True)
    color_changes = Column(Float, nullable=True)
    temperature_wound_site = Column(Float, nullable=True)
    blood_flow_perfusion = Column(Float, nullable=True)
    nutritional_status = Column(Float, nullable=True)
    systemic_indicators = Column(Float, nullable=True)
    user_email = Column(String, ForeignKey("users.email"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_by = Column(String, nullable=True)
    updated_by = Column(String, nullable=True)


class BrainMonitoring(Base):
    __tablename__ = "brain_monitorings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    alpha_waves = Column(Float, nullable=True)
    theta_waves = Column(Float, nullable=True)
    beta_waves = Column(Float, nullable=True)
    gamma_waves = Column(Float, nullable=True)
    heart_rate = Column(Float, nullable=True)
    heart_rate_variability = Column(Float, nullable=True)
    electromyography = Column(Float, nullable=True)
    respiration_rate = Column(Float, nullable=True)
    electrodermal_activity = Column(Float, nullable=True)
    peripheral_skin_temperature = Column(Float, nullable=True)
    user_email = Column(String, ForeignKey("users.email"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_by = Column(String, nullable=True)
    updated_by = Column(String, nullable=True)


class HeartBrainSynchronicity(Base):
    __tablename__ = "heart_brain_synchronicities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    heart_rate_variability = Column(Float, nullable=True)
    alpha_waves = Column(Float, nullable=True)
    respiratory_sinus_arrhythmia = Column(Float, nullable=True)
    coherence_ratio = Column(Float, nullable=True)
    brainwave_coherence = Column(Float, nullable=True)
    blood_pressure_variability = Column(Float, nullable=True)
    electrodermal_activity = Column(Float, nullable=True)
    breathing_patterns = Column(Float, nullable=True)
    subjective_measures = Column(Float, nullable=True)
    user_email = Column(String, ForeignKey("users.email"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_by = Column(String, nullable=True)
    updated_by = Column(String, nullable=True)