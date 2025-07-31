from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.db.base import get_db
from app.schemas.contact import ContactOut, ContactCreate, ContactUpdate
from app.crud.contact import create_contact, get_contact, get_latest_contact, update_contact, delete_contact
from app.core.security import require_role

router = APIRouter(
    prefix="/admin/contact",
    tags=["admin-contact"],
    dependencies=[Depends(require_role(["Admin"]))]
)

@router.post("/", response_model=ContactOut, summary="Admin: Create contact information")
def admin_create_contact(contact: ContactCreate, db: Session = Depends(get_db)):
    return create_contact(db, contact)

@router.get("/", response_model=ContactOut, summary="Admin: Get current contact information")
def admin_get_contact(db: Session = Depends(get_db)):
    contact = get_latest_contact(db)
    if not contact:
        raise HTTPException(status_code=404, detail="No contact information found")
    return contact

@router.get("/{contact_id}", response_model=ContactOut, summary="Admin: Get specific contact information")
def admin_get_contact_by_id(contact_id: UUID, db: Session = Depends(get_db)):
    contact = get_contact(db, contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact information not found")
    return contact

@router.put("/{contact_id}", response_model=ContactOut, summary="Admin: Update contact information")
def admin_update_contact(contact_id: UUID, contact_update: ContactUpdate, db: Session = Depends(get_db)):
    contact = update_contact(db, contact_id, contact_update)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact information not found")
    return contact

@router.delete("/{contact_id}", summary="Admin: Delete contact information")
def admin_delete_contact(contact_id: UUID, db: Session = Depends(get_db)):
    success = delete_contact(db, contact_id)
    if not success:
        raise HTTPException(status_code=404, detail="Contact information not found")
    return {"message": "Contact information deleted successfully"}
