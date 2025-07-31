from app.core.security import authenticate_user, create_access_token, create_refresh_token, get_current_user
from app.db.base import get_db
from app.models import User, UserRole
from app.schemas import Token, UserCreate, UserOut, TokenAdmin
from app.services.user_service import (handle_login, handle_logout,
                                     handle_signup, handle_token_refresh)
from fastapi import APIRouter, Depends, HTTPException, Security, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from app.models.user import UserStatus
from app.crud import user as user_crud  # Add this import

router = APIRouter(tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

# Reusable dependencies
get_db_dep = Depends(get_db)
get_current_user_dep = Depends(get_current_user)


@router.post("/signup", response_model=UserOut)
def signup(user: UserCreate, db: Session = get_db_dep):
    return handle_signup(user, db)


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = get_db_dep):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )

    # Check user status
    if user.user_status == UserStatus.inactive:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated. Please contact support."
        )
    
    if user.user_status == UserStatus.pending:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account is pending activation. Please wait for admin approval."
        )

    access_token = create_access_token(data={"sub": user.email})
    refresh_token = create_refresh_token(data={"sub": user.email})
    user_crud.set_refresh_token(db, user, refresh_token)  # Now this will work

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }

@router.post(
    "/admin-login",
    response_model=TokenAdmin,
    summary="Login as admin and get tokens + is_admin flag",
)
def admin_login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )

    if user.role != UserRole.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized as admin"
        )
        
    # Check user status for admin too
    if user.user_status == UserStatus.inactive:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your admin account has been deactivated. Please contact support."
        )
    
    if user.user_status == UserStatus.pending:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your admin account is pending activation."
        )

    access_token = create_access_token({"sub": user.email})
    refresh_token = create_refresh_token({"sub": user.email})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "is_admin": True
    }

@router.post("/refresh", response_model=Token)
def refresh_token(refresh_token: str, db: Session = get_db_dep):
    return handle_token_refresh(refresh_token, db)


@router.post("/logout")
def logout(
    current_user: User = get_current_user_dep,
    db: Session = get_db_dep,
    token: str = Security(oauth2_scheme),
):
    return handle_logout(current_user, db)
