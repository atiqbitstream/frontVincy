from datetime import datetime
from uuid import UUID
from typing import Optional

from pydantic import BaseModel, EmailStr


# Base classes with common fields
class DeviceControlBase(BaseModel):
    user_email: EmailStr


class DeviceControlCreate(DeviceControlBase):
    created_by: Optional[str] = None


class DeviceControlUpdate(BaseModel):
    updated_by: Optional[str] = None


class DeviceControlOut(DeviceControlBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None
    created_by: Optional[str] = None
    updated_by: Optional[str] = None

    model_config = {"from_attributes": True}


# Sound specific schemas
class SoundBase(DeviceControlBase):
    sound: bool


class SoundCreate(SoundBase, DeviceControlCreate):
    pass


class SoundUpdate(DeviceControlUpdate):
    sound: Optional[bool] = None


class SoundOut(SoundBase, DeviceControlOut):
    pass


# Steam specific schemas
class SteamBase(DeviceControlBase):
    steam: bool


class SteamCreate(SteamBase, DeviceControlCreate):
    pass


class SteamUpdate(DeviceControlUpdate):
    steam: Optional[bool] = None


class SteamOut(SteamBase, DeviceControlOut):
    pass


# TempTank specific schemas
class TempTankBase(DeviceControlBase):
    temp_tank: float


class TempTankCreate(TempTankBase, DeviceControlCreate):
    pass


class TempTankUpdate(DeviceControlUpdate):
    temp_tank: Optional[float] = None


class TempTankOut(TempTankBase, DeviceControlOut):
    pass


# WaterPump specific schemas
class WaterPumpBase(DeviceControlBase):
    water_pump: bool


class WaterPumpCreate(WaterPumpBase, DeviceControlCreate):
    pass


class WaterPumpUpdate(DeviceControlUpdate):
    water_pump: Optional[bool] = None


class WaterPumpOut(WaterPumpBase, DeviceControlOut):
    pass


# NanoFlicker specific schemas
class NanoFlickerBase(DeviceControlBase):
    nano_flicker: bool


class NanoFlickerCreate(NanoFlickerBase, DeviceControlCreate):
    pass


class NanoFlickerUpdate(DeviceControlUpdate):
    nano_flicker: Optional[bool] = None


class NanoFlickerOut(NanoFlickerBase, DeviceControlOut):
    pass


# LedColor specific schemas
class LedColorBase(DeviceControlBase):
    led_color: str


class LedColorCreate(LedColorBase, DeviceControlCreate):
    pass


class LedColorUpdate(DeviceControlUpdate):
    led_color: Optional[str] = None


class LedColorOut(LedColorBase, DeviceControlOut):
    pass