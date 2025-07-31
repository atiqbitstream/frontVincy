from datetime import datetime, timedelta, timezone

from app.core.config import settings
from app.crud.user import get_user_by_email
from app.db.base import get_db
from app.models import User
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from app.models.user import UserRole, UserStatus
from sqlalchemy.orm import Session

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = HTTPBearer()


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def password_hash(password):
    return pwd_context.hash(password)


def create_jwt_token(data: dict, expiry_minutes: int) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=expiry_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_access_token(data: dict) -> str:
    return create_jwt_token(data, settings.ACCESS_TOKEN_EXPIRE_MINUTES)


def create_refresh_token(data: dict) -> str:
    return create_jwt_token(data, settings.REFRESH_TOKEN_EXPIRE_MINUTES)


def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return False
    if not verify_password(password, user.password_hash):
        return False
    return user


def extract_email_from_token(token: str) -> str:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        email = payload.get("sub")
        if not email:
            raise ValueError
        return email
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token"
        )


db_dependency = Depends(get_db)


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(oauth2_scheme), db: Session = db_dependency):
    try:
        token = credentials.credentials
        email = extract_email_from_token(token)
        user = get_user_by_email(db, email=email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        # Check if user is inactive
        if user.user_status == UserStatus.inactive:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is deactivated"
            )
            
        if user.user_status == UserStatus.pending:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is pending activation"
            )
            
        return user
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


def require_role(required_roles: list[UserRole]):
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in required_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this resource",
            )
        return current_user

    return role_checker
