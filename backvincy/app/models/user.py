import enum
import uuid
from datetime import date

from app.db.base import Base
from sqlalchemy import Boolean, Column, DateTime, Date, Enum, ForeignKey, String, Float, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func


class UserRole(str, enum.Enum):
    admin = "Admin"
    user = "User"  # Added standard user role


class UserStatus(str, enum.Enum):
    active = "Active"
    inactive = "Inactive"
    pending = "Pending"


class Gender(str, enum.Enum):
    male = "Male"
    female = "Female"
    other = "Other"
    prefer_not_to_say = "Prefer not to say"


class ExerciseFrequency(str, enum.Enum):
    never = "Never"
    rarely = "Rarely"
    sometimes = "Sometimes"
    regularly = "Regularly"
    daily = "Daily"


class SmokingStatus(str, enum.Enum):
    non_smoker = "Non-smoker"
    former_smoker = "Former smoker"
    occasional_smoker = "Occasional smoker"
    regular_smoker = "Regular smoker"


class AlcoholConsumption(str, enum.Enum):
    never = "Never"
    rarely = "Rarely"
    sometimes = "Sometimes"
    regularly = "Regularly"
    frequently = "Frequently"


class MaritalStatus(str, enum.Enum):
    single = "Single"
    married = "Married"
    divorced = "Divorced"
    widowed = "Widowed"
    separated = "Separated"


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(UserRole, values_callable=lambda enum: [e.value for e in enum]), default=UserRole.user)
    
    # Extended user profile fields
    full_name = Column(String, nullable=True)
    gender = Column(Enum(Gender), nullable=True)
    dob = Column(Date, nullable=True)
    nationality = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    city = Column(String, nullable=True)
    country = Column(String, nullable=True)
    occupation = Column(String, nullable=True)
    marital_status = Column(Enum(MaritalStatus), nullable=True)
    sleep_hours = Column(Float, nullable=True)
    exercise_frequency = Column(Enum(ExerciseFrequency), nullable=True)
    smoking_status = Column(Enum(SmokingStatus), nullable=True)
    alcohol_consumption = Column(Enum(AlcoholConsumption), nullable=True)
    user_status = Column(Enum(UserStatus), default=UserStatus.inactive)
    
    refresh_token = Column(String, nullable=True)
    
    # Audit fields
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_by = Column(String, nullable=True)
    updated_by = Column(String, nullable=True)