from typing import List,Optional
from fastapi import APIRouter, Depends, HTTPException
from .. import models, schemas
from sqlalchemy.orm import Session
from uuid import UUID

from app.db.base import get_db
from app.core.security import get_current_user
from app.models import User
from app.crud import device_controls as crud
from app.schemas import (
    SoundCreate, SoundUpdate, SoundOut,
    SteamCreate, SteamUpdate, SteamOut,
    TempTankCreate, TempTankUpdate, TempTankOut,
    WaterPumpCreate, WaterPumpUpdate, WaterPumpOut,
    NanoFlickerCreate, NanoFlickerUpdate, NanoFlickerOut,
    LedColorCreate, LedColorUpdate, LedColorOut,
)
from pydantic import BaseModel


router = APIRouter(prefix="/device-controls", tags=["Device Controls"])

# Utility dependency
def user_dep():
    return Depends(get_current_user)

# === SOUND ===
@router.post("/sound", response_model=SoundOut)
def create_sound(sound: SoundCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return crud.create_sound(db, sound,current_user.email)

@router.get("/sound/{sound_id}", response_model=SoundOut)
def get_sound(sound_id: UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    sound = crud.get_sound(db, sound_id)
    if not sound:
        raise HTTPException(status_code=404, detail="Sound not found")
    return sound

@router.get(
    "/sound",
    response_model=List[schemas.SoundOut],
    summary="List sound entries for this user",
)
def list_led_color(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return (
        db.query(models.Sound)
        .filter(models.Sound.user_email == current_user.email)
        .order_by(models.Sound.created_at.desc())
        .all()
    )


@router.put("/sound/{sound_id}", response_model=SoundOut)
def update_sound(sound_id: UUID, sound: SoundUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return crud.update_sound(db, sound_id, sound)

@router.delete("/sound/{sound_id}")
def delete_sound(sound_id: UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    success = crud.delete_sound(db, sound_id)
    if not success:
        raise HTTPException(status_code=404, detail="Sound not found")
    return {"detail": "Sound deleted successfully"}


# === STEAM ===
@router.post("/steam", response_model=SteamOut)
def create_steam(steam: SteamCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return crud.create_steam(db, steam)

@router.get("/steam/{steam_id}", response_model=SteamOut)
def get_steam(steam_id: UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    steam = crud.get_steam(db, steam_id)
    if not steam:
        raise HTTPException(status_code=404, detail="Steam not found")
    return steam

@router.get(
    "/steam",
    response_model=List[schemas.SteamOut],
    summary="List steam entries for this user",
)
def list_led_color(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return (
        db.query(models.Steam)
        .filter(models.Steam.user_email == current_user.email)
        .order_by(models.Steam.created_at.desc())
        .all()
    )

@router.put("/steam/{steam_id}", response_model=SteamOut)
def update_steam(steam_id: UUID, steam: SteamUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return crud.update_steam(db, steam_id, steam)

@router.delete("/steam/{steam_id}")
def delete_steam(steam_id: UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    success = crud.delete_steam(db, steam_id)
    if not success:
        raise HTTPException(status_code=404, detail="Steam not found")
    return {"detail": "Steam deleted successfully"}


# === TEMP TANK ===
@router.post("/temp-tank", response_model=TempTankOut)
def create_temp_tank(data: TempTankCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return crud.create_temp_tank(db, data)

@router.get("/temp-tank/{id}", response_model=TempTankOut)
def get_temp_tank(id: UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    obj = crud.get_temp_tank(db, id)
    if not obj:
        raise HTTPException(status_code=404, detail="TempTank not found")
    return obj

@router.get(
    "/temp-tank",
    response_model=List[schemas.TempTankOut],
    summary="List temperature tank entries for this user",
)
def list_led_color(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return (
        db.query(models.TempTank)
        .filter(models.TempTank.user_email == current_user.email)
        .order_by(models.TempTank.created_at.desc())
        .all()
    )

@router.put("/temp-tank/{id}", response_model=TempTankOut)
def update_temp_tank(id: UUID, update: TempTankUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return crud.update_temp_tank(db, id, update)

@router.delete("/temp-tank/{id}")
def delete_temp_tank(id: UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    success = crud.delete_temp_tank(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="TempTank not found")
    return {"detail": "TempTank deleted successfully"}


# === WATER PUMP ===
@router.post("/water-pump", response_model=WaterPumpOut)
def create_water_pump(data: WaterPumpCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return crud.create_water_pump(db, data)

@router.get("/water-pump/{id}", response_model=WaterPumpOut)
def get_water_pump(id: UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    obj = crud.get_water_pump(db, id)
    if not obj:
        raise HTTPException(status_code=404, detail="WaterPump not found")
    return obj

@router.get(
    "/water-pump",
    response_model=List[schemas.WaterPumpOut],
    summary="List water pump entries for this user",
)
def list_led_color(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return (
        db.query(models.WaterPump)
        .filter(models.WaterPump.user_email == current_user.email)
        .order_by(models.WaterPump.created_at.desc())
        .all()
    )

@router.put("/water-pump/{id}", response_model=WaterPumpOut)
def update_water_pump(id: UUID, update: WaterPumpUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return crud.update_water_pump(db, id, update)

@router.delete("/water-pump/{id}")
def delete_water_pump(id: UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    success = crud.delete_water_pump(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="WaterPump not found")
    return {"detail": "WaterPump deleted successfully"}


# === NANO FLICKER ===
@router.post("/nano-flicker", response_model=NanoFlickerOut)
def create_nano_flicker(data: NanoFlickerCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return crud.create_nano_flicker(db, data)

@router.get("/nano-flicker/{id}", response_model=NanoFlickerOut)
def get_nano_flicker(id: UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    obj = crud.get_nano_flicker(db, id)
    if not obj:
        raise HTTPException(status_code=404, detail="NanoFlicker not found")
    return obj

@router.get(
    "/nano-flicker",
    response_model=List[schemas.NanoFlickerOut],
    summary="List Nano Flicker entries for this user",
)
def list_nano_flicker(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return (
        db.query(models.NanoFlicker)
        .filter(models.NanoFlicker.user_email == current_user.email)
        .order_by(models.NanoFlicker.created_at.desc())
        .all()
    )

@router.put("/nano-flicker/{id}", response_model=NanoFlickerOut)
def update_nano_flicker(id: UUID, update: NanoFlickerUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return crud.update_nano_flicker(db, id, update)

@router.delete("/nano-flicker/{id}")
def delete_nano_flicker(id: UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    success = crud.delete_nano_flicker(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="NanoFlicker not found")
    return {"detail": "NanoFlicker deleted successfully"}


# === LED COLOR ===
@router.post("/led-color", response_model=LedColorOut)
def create_led_color(data: LedColorCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return crud.create_led_color(db, data)

@router.get("/led-color/{id}", response_model=LedColorOut)
def get_led_color(id: UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    obj = crud.get_led_color(db, id)
    if not obj:
        raise HTTPException(status_code=404, detail="LedColor not found")
    return obj

@router.get(
    "/led-color",
    response_model=List[schemas.LedColorOut],
    summary="List LED Color entries for this user",
)
def list_led_color(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return (
        db.query(models.LedColor)
        .filter(models.LedColor.user_email == current_user.email)
        .order_by(models.LedColor.created_at.desc())
        .all()
    )

@router.put("/led-color/{id}", response_model=LedColorOut)
def update_led_color(id: UUID, update: LedColorUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return crud.update_led_color(db, id, update)

@router.delete("/led-color/{id}")
def delete_led_color(id: UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    success = crud.delete_led_color(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="LedColor not found")
    return {"detail": "LedColor deleted successfully"}






# Define a response model for the consolidated endpoint
class DeviceControlsLatest(BaseModel):
    sound: Optional[SoundOut] = None
    steam: Optional[SteamOut] = None
    temp_tank: Optional[TempTankOut] = None
    water_pump: Optional[WaterPumpOut] = None
    nano_flicker: Optional[NanoFlickerOut] = None
    led_color: Optional[LedColorOut] = None

    model_config = {"from_attributes": True}

# Add this to your existing router
@router.get(
    "/latest",
    response_model=DeviceControlsLatest,
    summary="Get latest values for all device controls",
)
def get_latest_device_controls(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get the latest value for each device control for the current user.
    """
    user_email = current_user.email
    
    # Get the latest entry for each device control
    latest_sound = crud.get_sound_by_user_email(db, user_email)
    latest_steam = crud.get_steam_by_user_email(db, user_email)
    latest_temp_tank = crud.get_temp_tank_by_user_email(db, user_email)
    latest_water_pump = crud.get_water_pump_by_user_email(db, user_email)
    latest_nano_flicker = crud.get_nano_flicker_by_user_email(db, user_email)
    latest_led_color = crud.get_led_color_by_user_email(db, user_email)
    
    # Construct the response
    return DeviceControlsLatest(
        sound=latest_sound,
        steam=latest_steam,
        temp_tank=latest_temp_tank,
        water_pump=latest_water_pump,
        nano_flicker=latest_nano_flicker,
        led_color=latest_led_color,
    )

# Individual latest endpoints for each device control
@router.get(
    "/sound/latest",
    response_model=SoundOut,
    summary="Get the latest sound setting",
)
def get_latest_sound(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get the latest sound setting for the current user.
    """
    latest_sound = crud.get_sound_by_user_email(db, current_user.email)
    if not latest_sound:
        raise HTTPException(status_code=404, detail="No sound settings found")
    return latest_sound

@router.get(
    "/steam/latest",
    response_model=SteamOut,
    summary="Get the latest steam setting",
)
def get_latest_steam(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get the latest steam setting for the current user.
    """
    latest_steam = crud.get_steam_by_user_email(db, current_user.email)
    if not latest_steam:
        raise HTTPException(status_code=404, detail="No steam settings found")
    return latest_steam

@router.get(
    "/temp-tank/latest",
    response_model=TempTankOut,
    summary="Get the latest temperature tank setting",
)
def get_latest_temp_tank(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get the latest temperature tank setting for the current user.
    """
    latest_temp_tank = crud.get_temp_tank_by_user_email(db, current_user.email)
    if not latest_temp_tank:
        raise HTTPException(status_code=404, detail="No temperature tank settings found")
    return latest_temp_tank

@router.get(
    "/water-pump/latest",
    response_model=WaterPumpOut,
    summary="Get the latest water pump setting",
)
def get_latest_water_pump(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get the latest water pump setting for the current user.
    """
    latest_water_pump = crud.get_water_pump_by_user_email(db, current_user.email)
    if not latest_water_pump:
        raise HTTPException(status_code=404, detail="No water pump settings found")
    return latest_water_pump

@router.get(
    "/nano-flicker/latest",
    response_model=NanoFlickerOut,
    summary="Get the latest nano flicker setting",
)
def get_latest_nano_flicker(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get the latest nano flicker setting for the current user.
    """
    latest_nano_flicker = crud.get_nano_flicker_by_user_email(db, current_user.email)
    if not latest_nano_flicker:
        raise HTTPException(status_code=404, detail="No nano flicker settings found")
    return latest_nano_flicker

@router.get(
    "/led-color/latest",
    response_model=LedColorOut,
    summary="Get the latest LED color setting",
)
def get_latest_led_color(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get the latest LED color setting for the current user.
    """
    latest_led_color = crud.get_led_color_by_user_email(db, current_user.email)
    if not latest_led_color:
        raise HTTPException(status_code=404, detail="No LED color settings found")
    return latest_led_color