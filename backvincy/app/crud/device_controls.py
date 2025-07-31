from uuid import UUID
from typing import List, Optional

from sqlalchemy.orm import Session

from app.models import Sound, Steam, TempTank, WaterPump, NanoFlicker, LedColor
from app.schemas.device_controls import (
    SoundCreate, SoundUpdate,
    SteamCreate, SteamUpdate,
    TempTankCreate, TempTankUpdate,
    WaterPumpCreate, WaterPumpUpdate,
    NanoFlickerCreate, NanoFlickerUpdate,
    LedColorCreate, LedColorUpdate
)


# Sound CRUD operations
def create_sound(db: Session, sound: SoundCreate, current_user_email: str) -> Sound:
    db_sound = Sound(
        sound=sound.sound,
        user_email=sound.user_email,
        created_by=current_user_email,  # Set created_by
        updated_by=current_user_email   # Set updated_b
    )
    db.add(db_sound)
    db.commit()
    db.refresh(db_sound)
    return db_sound


def get_sound(db: Session, sound_id: UUID) -> Optional[Sound]:
    return db.query(Sound).filter(Sound.id == sound_id).first()


def get_sound_by_user_email(db: Session, user_email: str) -> Optional[Sound]:
    return db.query(Sound).filter(Sound.user_email == user_email).order_by(Sound.created_at.desc()).first()


def get_sounds_by_user_email(db: Session, user_email: str, skip: int = 0, limit: int = 100) -> List[Sound]:
    return db.query(Sound).filter(Sound.user_email == user_email).order_by(Sound.created_at.desc()).offset(skip).limit(limit).all()


def update_sound(db: Session, sound_id: UUID, sound_update: SoundUpdate) -> Optional[Sound]:
    db_sound = get_sound(db, sound_id)
    if db_sound:
        update_data = sound_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_sound, key, value)
        db.commit()
        db.refresh(db_sound)
    return db_sound


def delete_sound(db: Session, sound_id: UUID) -> bool:
    db_sound = get_sound(db, sound_id)
    if db_sound:
        db.delete(db_sound)
        db.commit()
        return True
    return False


# Steam CRUD operations
def create_steam(db: Session, steam: SteamCreate) -> Steam:
    db_steam = Steam(
        steam=steam.steam,
        user_email=steam.user_email,
        created_by=steam.created_by
    )
    db.add(db_steam)
    db.commit()
    db.refresh(db_steam)
    return db_steam


def get_steam(db: Session, steam_id: UUID) -> Optional[Steam]:
    return db.query(Steam).filter(Steam.id == steam_id).first()


def get_steam_by_user_email(db: Session, user_email: str) -> Optional[Steam]:
    return db.query(Steam).filter(Steam.user_email == user_email).order_by(Steam.created_at.desc()).first()


def get_steams_by_user_email(db: Session, user_email: str, skip: int = 0, limit: int = 100) -> List[Steam]:
    return db.query(Steam).filter(Steam.user_email == user_email).order_by(Steam.created_at.desc()).offset(skip).limit(limit).all()


def update_steam(db: Session, steam_id: UUID, steam_update: SteamUpdate) -> Optional[Steam]:
    db_steam = get_steam(db, steam_id)
    if db_steam:
        update_data = steam_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_steam, key, value)
        db.commit()
        db.refresh(db_steam)
    return db_steam


def delete_steam(db: Session, steam_id: UUID) -> bool:
    db_steam = get_steam(db, steam_id)
    if db_steam:
        db.delete(db_steam)
        db.commit()
        return True
    return False


# TempTank CRUD operations
def create_temp_tank(db: Session, temp_tank: TempTankCreate) -> TempTank:
    db_temp_tank = TempTank(
        temp_tank=temp_tank.temp_tank,
        user_email=temp_tank.user_email,
        created_by=temp_tank.created_by
    )
    db.add(db_temp_tank)
    db.commit()
    db.refresh(db_temp_tank)
    return db_temp_tank


def get_temp_tank(db: Session, temp_tank_id: UUID) -> Optional[TempTank]:
    return db.query(TempTank).filter(TempTank.id == temp_tank_id).first()


def get_temp_tank_by_user_email(db: Session, user_email: str) -> Optional[TempTank]:
    return db.query(TempTank).filter(TempTank.user_email == user_email).order_by(TempTank.created_at.desc()).first()


def get_temp_tanks_by_user_email(db: Session, user_email: str, skip: int = 0, limit: int = 100) -> List[TempTank]:
    return db.query(TempTank).filter(TempTank.user_email == user_email).order_by(TempTank.created_at.desc()).offset(skip).limit(limit).all()


def update_temp_tank(db: Session, temp_tank_id: UUID, temp_tank_update: TempTankUpdate) -> Optional[TempTank]:
    db_temp_tank = get_temp_tank(db, temp_tank_id)
    if db_temp_tank:
        update_data = temp_tank_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_temp_tank, key, value)
        db.commit()
        db.refresh(db_temp_tank)
    return db_temp_tank


def delete_temp_tank(db: Session, temp_tank_id: UUID) -> bool:
    db_temp_tank = get_temp_tank(db, temp_tank_id)
    if db_temp_tank:
        db.delete(db_temp_tank)
        db.commit()
        return True
    return False


# WaterPump CRUD operations
def create_water_pump(db: Session, water_pump: WaterPumpCreate) -> WaterPump:
    db_water_pump = WaterPump(
        water_pump=water_pump.water_pump,
        user_email=water_pump.user_email,
        created_by=water_pump.created_by
    )
    db.add(db_water_pump)
    db.commit()
    db.refresh(db_water_pump)
    return db_water_pump


def get_water_pump(db: Session, water_pump_id: UUID) -> Optional[WaterPump]:
    return db.query(WaterPump).filter(WaterPump.id == water_pump_id).first()


def get_water_pump_by_user_email(db: Session, user_email: str) -> Optional[WaterPump]:
    return db.query(WaterPump).filter(WaterPump.user_email == user_email).order_by(WaterPump.created_at.desc()).first()


def get_water_pumps_by_user_email(db: Session, user_email: str, skip: int = 0, limit: int = 100) -> List[WaterPump]:
    return db.query(WaterPump).filter(WaterPump.user_email == user_email).order_by(WaterPump.created_at.desc()).offset(skip).limit(limit).all()


def update_water_pump(db: Session, water_pump_id: UUID, water_pump_update: WaterPumpUpdate) -> Optional[WaterPump]:
    db_water_pump = get_water_pump(db, water_pump_id)
    if db_water_pump:
        update_data = water_pump_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_water_pump, key, value)
        db.commit()
        db.refresh(db_water_pump)
    return db_water_pump


def delete_water_pump(db: Session, water_pump_id: UUID) -> bool:
    db_water_pump = get_water_pump(db, water_pump_id)
    if db_water_pump:
        db.delete(db_water_pump)
        db.commit()
        return True
    return False


# NanoFlicker CRUD operations
def create_nano_flicker(db: Session, nano_flicker: NanoFlickerCreate) -> NanoFlicker:
    db_nano_flicker = NanoFlicker(
        nano_flicker=nano_flicker.nano_flicker,
        user_email=nano_flicker.user_email,
        created_by=nano_flicker.created_by
    )
    db.add(db_nano_flicker)
    db.commit()
    db.refresh(db_nano_flicker)
    return db_nano_flicker


def get_nano_flicker(db: Session, nano_flicker_id: UUID) -> Optional[NanoFlicker]:
    return db.query(NanoFlicker).filter(NanoFlicker.id == nano_flicker_id).first()


def get_nano_flicker_by_user_email(db: Session, user_email: str) -> Optional[NanoFlicker]:
    return db.query(NanoFlicker).filter(NanoFlicker.user_email == user_email).order_by(NanoFlicker.created_at.desc()).first()


def get_nano_flickers_by_user_email(db: Session, user_email: str, skip: int = 0, limit: int = 100) -> List[NanoFlicker]:
    return db.query(NanoFlicker).filter(NanoFlicker.user_email == user_email).order_by(NanoFlicker.created_at.desc()).offset(skip).limit(limit).all()


def update_nano_flicker(db: Session, nano_flicker_id: UUID, nano_flicker_update: NanoFlickerUpdate) -> Optional[NanoFlicker]:
    db_nano_flicker = get_nano_flicker(db, nano_flicker_id)
    if db_nano_flicker:
        update_data = nano_flicker_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_nano_flicker, key, value)
        db.commit()
        db.refresh(db_nano_flicker)
    return db_nano_flicker


def delete_nano_flicker(db: Session, nano_flicker_id: UUID) -> bool:
    db_nano_flicker = get_nano_flicker(db, nano_flicker_id)
    if db_nano_flicker:
        db.delete(db_nano_flicker)
        db.commit()
        return True
    return False


# LedColor CRUD operations
def create_led_color(db: Session, led_color: LedColorCreate) -> LedColor:
    db_led_color = LedColor(
        led_color=led_color.led_color,
        user_email=led_color.user_email,
        created_by=led_color.created_by
    )
    db.add(db_led_color)
    db.commit()
    db.refresh(db_led_color)
    return db_led_color


def get_led_color(db: Session, led_color_id: UUID) -> Optional[LedColor]:
    return db.query(LedColor).filter(LedColor.id == led_color_id).first()


def get_led_color_by_user_email(db: Session, user_email: str) -> Optional[LedColor]:
    return db.query(LedColor).filter(LedColor.user_email == user_email).order_by(LedColor.created_at.desc()).first()


def get_led_colors_by_user_email(db: Session, user_email: str, skip: int = 0, limit: int = 100) -> List[LedColor]:
    return db.query(LedColor).filter(LedColor.user_email == user_email).order_by(LedColor.created_at.desc()).offset(skip).limit(limit).all()


def update_led_color(db: Session, led_color_id: UUID, led_color_update: LedColorUpdate) -> Optional[LedColor]:
    db_led_color = get_led_color(db, led_color_id)
    if db_led_color:
        update_data = led_color_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_led_color, key, value)
        db.commit()
        db.refresh(db_led_color)
    return db_led_color


def delete_led_color(db: Session, led_color_id: UUID) -> bool:
    db_led_color = get_led_color(db, led_color_id)
    if db_led_color:
        db.delete(db_led_color)
        db.commit()
        return True
    return False


