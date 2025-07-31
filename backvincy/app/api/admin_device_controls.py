# app/api/admin_device_controls.py

from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import require_role
from app.db.base import get_db
from app.crud.device_controls import (
    get_sounds_by_user_email,
    get_sound,
    update_sound,
    delete_sound,
    get_steams_by_user_email,
    get_steam,
    update_steam,
    delete_steam,
    get_temp_tanks_by_user_email,
    get_temp_tank,
    update_temp_tank,
    delete_temp_tank,
    get_water_pumps_by_user_email,
    get_water_pump,
    update_water_pump,
    delete_water_pump,
    get_nano_flickers_by_user_email,
    get_nano_flicker,
    update_nano_flicker,
    delete_nano_flicker,
    get_led_colors_by_user_email,
    get_led_color,
    update_led_color,
    delete_led_color,
)
from app.schemas.device_controls import (
    SoundOut, SoundUpdate,
    SteamOut, SteamUpdate,
    TempTankOut, TempTankUpdate,
    WaterPumpOut, WaterPumpUpdate,
    NanoFlickerOut, NanoFlickerUpdate,
    LedColorOut, LedColorUpdate,
)

router = APIRouter(
    prefix="/admin/device-controls",
    tags=["admin-device-controls"],
    dependencies=[Depends(require_role(["Admin"]))],
)

# === SOUND ===
@router.get(
    "/users/{user_email}/sound",
    response_model=List[SoundOut],
    summary="Admin: List all Sound entries for a user",
)
def admin_list_sounds(user_email: str, db: Session = Depends(get_db)):
    return get_sounds_by_user_email(db, user_email)

@router.get(
    "/sound/{sound_id}",
    response_model=SoundOut,
    summary="Admin: Get a specific Sound entry",
)
def admin_get_sound(sound_id: UUID, db: Session = Depends(get_db)):
    obj = get_sound(db, sound_id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sound not found")
    return obj

@router.put(
    "/sound/{sound_id}",
    response_model=SoundOut,
    summary="Admin: Update any Sound entry",
)
def admin_update_sound(sound_id: UUID, payload: SoundUpdate, db: Session = Depends(get_db)):
    updated = update_sound(db, sound_id, payload)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sound not found")
    return updated

@router.delete(
    "/sound/{sound_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Admin: Delete any Sound entry",
)
def admin_delete_sound(sound_id: UUID, db: Session = Depends(get_db)):
    if not delete_sound(db, sound_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sound not found")


# === STEAM ===
@router.get(
    "/users/{user_email}/steam",
    response_model=List[SteamOut],
    summary="Admin: List all Steam entries for a user",
)
def admin_list_steams(user_email: str, db: Session = Depends(get_db)):
    return get_steams_by_user_email(db, user_email)

@router.get(
    "/steam/{steam_id}",
    response_model=SteamOut,
    summary="Admin: Get a specific Steam entry",
)
def admin_get_steam(steam_id: UUID, db: Session = Depends(get_db)):
    obj = get_steam(db, steam_id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Steam not found")
    return obj

@router.put(
    "/steam/{steam_id}",
    response_model=SteamOut,
    summary="Admin: Update any Steam entry",
)
def admin_update_steam(steam_id: UUID, payload: SteamUpdate, db: Session = Depends(get_db)):
    updated = update_steam(db, steam_id, payload)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Steam not found")
    return updated

@router.delete(
    "/steam/{steam_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Admin: Delete any Steam entry",
)
def admin_delete_steam(steam_id: UUID, db: Session = Depends(get_db)):
    if not delete_steam(db, steam_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Steam not found")


# === TEMP TANK ===
@router.get(
    "/users/{user_email}/temp-tank",
    response_model=List[TempTankOut],
    summary="Admin: List all TempTank entries for a user",
)
def admin_list_temp_tanks(user_email: str, db: Session = Depends(get_db)):
    return get_temp_tanks_by_user_email(db, user_email)

@router.get(
    "/temp-tank/{temp_tank_id}",
    response_model=TempTankOut,
    summary="Admin: Get a specific TempTank entry",
)
def admin_get_temp_tank(temp_tank_id: UUID, db: Session = Depends(get_db)):
    obj = get_temp_tank(db, temp_tank_id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="TempTank not found")
    return obj

@router.put(
    "/temp-tank/{temp_tank_id}",
    response_model=TempTankOut,
    summary="Admin: Update any TempTank entry",
)
def admin_update_temp_tank(temp_tank_id: UUID, payload: TempTankUpdate, db: Session = Depends(get_db)):
    updated = update_temp_tank(db, temp_tank_id, payload)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="TempTank not found")
    return updated

@router.delete(
    "/temp-tank/{temp_tank_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Admin: Delete any TempTank entry",
)
def admin_delete_temp_tank(temp_tank_id: UUID, db: Session = Depends(get_db)):
    if not delete_temp_tank(db, temp_tank_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="TempTank not found")


# === WATER PUMP ===
@router.get(
    "/users/{user_email}/water-pump",
    response_model=List[WaterPumpOut],
    summary="Admin: List all WaterPump entries for a user",
)
def admin_list_water_pumps(user_email: str, db: Session = Depends(get_db)):
    return get_water_pumps_by_user_email(db, user_email)

@router.get(
    "/water-pump/{water_pump_id}",
    response_model=WaterPumpOut,
    summary="Admin: Get a specific WaterPump entry",
)
def admin_get_water_pump(water_pump_id: UUID, db: Session = Depends(get_db)):
    obj = get_water_pump(db, water_pump_id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="WaterPump not found")
    return obj

@router.put(
    "/water-pump/{water_pump_id}",
    response_model=WaterPumpOut,
    summary="Admin: Update any WaterPump entry",
)
def admin_update_water_pump(water_pump_id: UUID, payload: WaterPumpUpdate, db: Session = Depends(get_db)):
    updated = update_water_pump(db, water_pump_id, payload)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="WaterPump not found")
    return updated

@router.delete(
    "/water-pump/{water_pump_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Admin: Delete any WaterPump entry",
)
def admin_delete_water_pump(water_pump_id: UUID, db: Session = Depends(get_db)):
    if not delete_water_pump(db, water_pump_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="WaterPump not found")


# === NANO FLICKER ===
@router.get(
    "/users/{user_email}/nano-flicker",
    response_model=List[NanoFlickerOut],
    summary="Admin: List all NanoFlicker entries for a user",
)
def admin_list_nano_flickers(user_email: str, db: Session = Depends(get_db)):
    return get_nano_flickers_by_user_email(db, user_email)

@router.get(
    "/nano-flicker/{nano_flicker_id}",
    response_model=NanoFlickerOut,
    summary="Admin: Get a specific NanoFlicker entry",
)
def admin_get_nano_flicker(nano_flicker_id: UUID, db: Session = Depends(get_db)):
    obj = get_nano_flicker(db, nano_flicker_id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="NanoFlicker not found")
    return obj

@router.put(
    "/nano-flicker/{nano_flicker_id}",
    response_model=NanoFlickerOut,
    summary="Admin: Update any NanoFlicker entry",
)
def admin_update_nano_flicker(nano_flicker_id: UUID, payload: NanoFlickerUpdate, db: Session = Depends(get_db)):
    updated = update_nano_flicker(db, nano_flicker_id, payload)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="NanoFlicker not found")
    return updated

@router.delete(
    "/nano-flicker/{nano_flicker_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Admin: Delete any NanoFlicker entry",
)
def admin_delete_nano_flicker(nano_flicker_id: UUID, db: Session = Depends(get_db)):
    if not delete_nano_flicker(db, nano_flicker_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="NanoFlicker not found")


# === LED COLOR ===
@router.get(
    "/users/{user_email}/led-color",
    response_model=List[LedColorOut],
    summary="Admin: List all LedColor entries for a user",
)
def admin_list_led_colors(user_email: str, db: Session = Depends(get_db)):
    return get_led_colors_by_user_email(db, user_email)

@router.get(
    "/led-color/{led_color_id}",
    response_model=LedColorOut,
    summary="Admin: Get a specific LedColor entry",
)
def admin_get_led_color(led_color_id: UUID, db: Session = Depends(get_db)):
    obj = get_led_color(db, led_color_id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="LedColor not found")
    return obj

@router.put(
    "/led-color/{led_color_id}",
    response_model=LedColorOut,
    summary="Admin: Update any LedColor entry",
)
def admin_update_led_color(led_color_id: UUID, payload: LedColorUpdate, db: Session = Depends(get_db)):
    updated = update_led_color(db, led_color_id, payload)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="LedColor not found")
    return updated

@router.delete(
    "/led-color/{led_color_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Admin: Delete any LedColor entry",
)
def admin_delete_led_color(led_color_id: UUID, db: Session = Depends(get_db)):
    if not delete_led_color(db, led_color_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="LedColor not found")
