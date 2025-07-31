from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os
import uuid
from pathlib import Path
from typing import Optional

from app.core.security import require_role
from app.db.base import get_db

router = APIRouter(
    prefix="/admin/upload",
    tags=["file-upload"],
    dependencies=[Depends(require_role(["Admin"]))]
)

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Allowed file extensions
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}

def is_allowed_file(filename: str) -> bool:
    """Check if file extension is allowed"""
    return Path(filename).suffix.lower() in ALLOWED_EXTENSIONS

@router.post("/image", summary="Upload image file")
async def upload_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload an image file and return the file path"""
    
    # Check if file is provided
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    # Check file extension
    if not is_allowed_file(file.filename):
        raise HTTPException(
            status_code=400, 
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Check file size (5MB limit)
    content = await file.read()
    if len(content) > 5 * 1024 * 1024:  # 5MB
        raise HTTPException(status_code=400, detail="File size too large. Maximum 5MB allowed")
    
    # Generate unique filename
    file_extension = Path(file.filename).suffix.lower()
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = UPLOAD_DIR / unique_filename
    
    # Save file
    try:
        with open(file_path, "wb") as buffer:
            buffer.write(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
    
    # Return the file URL path
    file_url = f"/uploads/{unique_filename}"
    
    return {
        "message": "File uploaded successfully",
        "file_url": file_url,
        "filename": unique_filename
    }

@router.get("/image/{filename}", summary="Get uploaded image")
async def get_uploaded_image(filename: str):
    """Serve uploaded image files"""
    file_path = UPLOAD_DIR / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(file_path)
