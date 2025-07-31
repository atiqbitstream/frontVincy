from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.db.base import get_db
from app.schemas.about import AboutOut, AboutCreate, AboutUpdate
from app.crud.about import create_about, get_about, get_latest_about, update_about, delete_about
from app.core.security import require_role

router = APIRouter(
    prefix="/admin/about",
    tags=["admin-about"],
    dependencies=[Depends(require_role(["Admin"]))]
)

@router.post("/", response_model=AboutOut, summary="Admin: Create about us information")
def admin_create_about(about: AboutCreate, db: Session = Depends(get_db)):
    return create_about(db, about)

@router.get("/", response_model=AboutOut, summary="Admin: Get current about us information")
def admin_get_about(db: Session = Depends(get_db)):
    about = get_latest_about(db)
    if not about:
        raise HTTPException(status_code=404, detail="No about us information found")
    return about

@router.get("/{about_id}", response_model=AboutOut, summary="Admin: Get specific about us information")
def admin_get_about_by_id(about_id: UUID, db: Session = Depends(get_db)):
    about = get_about(db, about_id)
    if not about:
        raise HTTPException(status_code=404, detail="About us information not found")
    return about

@router.put("/{about_id}", response_model=AboutOut, summary="Admin: Update about us information")
def admin_update_about(about_id: UUID, about_update: AboutUpdate, db: Session = Depends(get_db)):
    about = update_about(db, about_id, about_update)
    if not about:
        raise HTTPException(status_code=404, detail="About us information not found")
    return about

@router.delete("/{about_id}", summary="Admin: Delete about us information")
def admin_delete_about(about_id: UUID, db: Session = Depends(get_db)):
    success = delete_about(db, about_id)
    if not success:
        raise HTTPException(status_code=404, detail="About us information not found")
    return {"message": "About us information deleted successfully"}
