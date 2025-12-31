from app.core.security import (authenticate_user, create_access_token,
                               create_refresh_token, extract_email_from_token)
from app.crud import user as user_crud
from app.models import User
from app.schemas import UserCreate
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.services.email_service import send_new_user_notification
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


def handle_signup(user_data: UserCreate, db: Session) -> User:
   

    existing_user = user_crud.get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = user_crud.create_user(db, user_data)
    
    # Send email notification to admins (non-blocking)
    try:
        admin_emails = settings.admin_emails_list
        send_new_user_notification(
            user_email=new_user.email,
            user_name=new_user.full_name or new_user.email,
            admin_emails=admin_emails
        )
    except Exception as e:
        # Log the error but don't fail the signup
        logger.error(f"Failed to send admin notification email: {str(e)}")
   
    return new_user


def handle_login(email: str, password: str, db: Session) -> dict:
    user = authenticate_user(db, email, password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    access_token = create_access_token(data={"sub": user.email})
    refresh_token = create_refresh_token(data={"sub": user.email})
    user_crud.set_refresh_token(db, user, refresh_token)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


def handle_token_refresh(refresh_token: str, db: Session) -> dict:
    email = extract_email_from_token(refresh_token)
    user = user_crud.get_user_by_email(db, email)

    if not user or user.refresh_token != refresh_token:
        raise HTTPException(
            status_code=401, detail="Refresh token does not match or user not found"
        )

    new_access_token = create_access_token(data={"sub": user.email})
    new_refresh_token = create_refresh_token(data={"sub": user.email})
    user_crud.set_refresh_token(db, user, new_refresh_token)

    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
    }


def handle_logout(user: User, db: Session):
    user_crud.set_refresh_token(user, db, None)
    return {"message": "Successfully logged out"}
