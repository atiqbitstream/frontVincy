from datetime import datetime
from uuid import UUID
from typing import Optional

from pydantic import BaseModel, EmailStr


# Base class for all health monitoring schemas
class HealthMonitoringBase(BaseModel):
    user_email: EmailStr


class HealthMonitoringCreate(HealthMonitoringBase):
    created_by: Optional[str] = None


class HealthMonitoringUpdate(BaseModel):
    updated_by: Optional[str] = None


class HealthMonitoringOut(HealthMonitoringBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None
    created_by: Optional[str] = None
    updated_by: Optional[str] = None

    model_config = {"from_attributes": True}


# Biofeedback schemas
class BiofeedbackBase(HealthMonitoringBase):
    heart_rate: Optional[float] = None
    heart_rate_variability: Optional[float] = None
    electromyography: Optional[float] = None
    electrodermal_activity: Optional[float] = None
    respiration_rate: Optional[float] = None
    blood_pressure: Optional[float] = None
    temperature: Optional[float] = None
    brainwave_activity: Optional[float] = None
    oxygen_saturation: Optional[float] = None
    blood_glucose_levels: Optional[float] = None
    galvanic_skin_response: Optional[float] = None


class BiofeedbackCreate(BiofeedbackBase, HealthMonitoringCreate):
    pass


class BiofeedbackUpdate(HealthMonitoringUpdate):
    heart_rate: Optional[float] = None
    heart_rate_variability: Optional[float] = None
    electromyography: Optional[float] = None
    electrodermal_activity: Optional[float] = None
    respiration_rate: Optional[float] = None
    blood_pressure: Optional[float] = None
    temperature: Optional[float] = None
    brainwave_activity: Optional[float] = None
    oxygen_saturation: Optional[float] = None
    blood_glucose_levels: Optional[float] = None
    galvanic_skin_response: Optional[float] = None


class BiofeedbackOut(BiofeedbackBase, HealthMonitoringOut):
    pass


# BurnProgress schemas
class BurnProgressBase(HealthMonitoringBase):
    wound_size_depth: Optional[float] = None
    epithelialization: Optional[float] = None
    exudate_amount_type: Optional[float] = None
    infection_indicators: Optional[float] = None
    granulation_tissue: Optional[float] = None
    pain_levels: Optional[float] = None
    swelling_edema: Optional[float] = None
    scarring: Optional[float] = None
    functional_recovery: Optional[float] = None
    color_changes: Optional[float] = None
    temperature_wound_site: Optional[float] = None
    blood_flow_perfusion: Optional[float] = None
    nutritional_status: Optional[float] = None
    systemic_indicators: Optional[float] = None


class BurnProgressCreate(BurnProgressBase, HealthMonitoringCreate):
    pass


class BurnProgressUpdate(HealthMonitoringUpdate):
    wound_size_depth: Optional[float] = None
    epithelialization: Optional[float] = None
    exudate_amount_type: Optional[float] = None
    infection_indicators: Optional[float] = None
    granulation_tissue: Optional[float] = None
    pain_levels: Optional[float] = None
    swelling_edema: Optional[float] = None
    scarring: Optional[float] = None
    functional_recovery: Optional[float] = None
    color_changes: Optional[float] = None
    temperature_wound_site: Optional[float] = None
    blood_flow_perfusion: Optional[float] = None
    nutritional_status: Optional[float] = None
    systemic_indicators: Optional[float] = None


class BurnProgressOut(BurnProgressBase, HealthMonitoringOut):
    pass


# BrainMonitoring schemas
class BrainMonitoringBase(HealthMonitoringBase):
    alpha_waves: Optional[float] = None
    theta_waves: Optional[float] = None
    beta_waves: Optional[float] = None
    gamma_waves: Optional[float] = None
    heart_rate: Optional[float] = None
    heart_rate_variability: Optional[float] = None
    electromyography: Optional[float] = None
    respiration_rate: Optional[float] = None
    electrodermal_activity: Optional[float] = None
    peripheral_skin_temperature: Optional[float] = None


class BrainMonitoringCreate(BrainMonitoringBase, HealthMonitoringCreate):
    pass


class BrainMonitoringUpdate(HealthMonitoringUpdate):
    alpha_waves: Optional[float] = None
    theta_waves: Optional[float] = None
    beta_waves: Optional[float] = None
    gamma_waves: Optional[float] = None
    heart_rate: Optional[float] = None
    heart_rate_variability: Optional[float] = None
    electromyography: Optional[float] = None
    respiration_rate: Optional[float] = None
    electrodermal_activity: Optional[float] = None
    peripheral_skin_temperature: Optional[float] = None


class BrainMonitoringOut(BrainMonitoringBase, HealthMonitoringOut):
    pass


# HeartBrainSynchronicity schemas
class HeartBrainSynchronicityBase(HealthMonitoringBase):
    heart_rate_variability: Optional[float] = None
    alpha_waves: Optional[float] = None
    respiratory_sinus_arrhythmia: Optional[float] = None
    coherence_ratio: Optional[float] = None
    brainwave_coherence: Optional[float] = None
    blood_pressure_variability: Optional[float] = None
    electrodermal_activity: Optional[float] = None
    breathing_patterns: Optional[float] = None
    subjective_measures: Optional[float] = None


class HeartBrainSynchronicityCreate(HeartBrainSynchronicityBase, HealthMonitoringCreate):
    pass


class HeartBrainSynchronicityUpdate(HealthMonitoringUpdate):
    heart_rate_variability: Optional[float] = None
    alpha_waves: Optional[float] = None
    respiratory_sinus_arrhythmia: Optional[float] = None
    coherence_ratio: Optional[float] = None
    brainwave_coherence: Optional[float] = None
    blood_pressure_variability: Optional[float] = None
    electrodermal_activity: Optional[float] = None
    breathing_patterns: Optional[float] = None
    subjective_measures: Optional[float] = None


class HeartBrainSynchronicityOut(HeartBrainSynchronicityBase, HealthMonitoringOut):
    pass