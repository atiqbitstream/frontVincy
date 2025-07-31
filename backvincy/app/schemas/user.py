from datetime import date
from enum import Enum
from uuid import UUID
from typing import Optional

from pydantic import BaseModel, EmailStr


class UserRole(str, Enum):
    admin = "Admin"
    user = "User"


class UserStatus(str, Enum):
    active = "Active"
    inactive = "Inactive"
    pending = "Pending"


class Gender(str, Enum):
    male = "Male"
    female = "Female"
    other = "Other"
    prefer_not_to_say = "Prefer not to say"


class ExerciseFrequency(str, Enum):
    never = "Never"
    rarely = "Rarely"
    sometimes = "Sometimes"
    regularly = "Regularly"
    daily = "Daily"


class SmokingStatus(str, Enum):
    non_smoker = "Non-smoker"
    former_smoker = "Former smoker"
    occasional_smoker = "Occasional smoker"
    regular_smoker = "Regular smoker"


class AlcoholConsumption(str, Enum):
    never = "Never"
    rarely = "Rarely"
    sometimes = "Sometimes"
    regularly = "Regularly"
    frequently = "Frequently"


class MaritalStatus(str, Enum):
    single = "Single"
    married = "Married"
    divorced = "Divorced"
    widowed = "Widowed"
    separated = "Separated"


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str
    role: UserRole = UserRole.user
    full_name: str  
    gender: Gender
    dob: date
    nationality: str
    phone: str
    city: str
    country: str
    occupation: str
    marital_status: MaritalStatus
    sleep_hours: float
    exercise_frequency: ExerciseFrequency
    smoking_status: SmokingStatus
    alcohol_consumption: AlcoholConsumption

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    gender: Optional[Gender] = None
    dob: Optional[date] = None
    nationality: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    occupation: Optional[str] = None
    marital_status: Optional[MaritalStatus] = None
    sleep_hours: Optional[float] = None
    exercise_frequency: Optional[ExerciseFrequency] = None
    smoking_status: Optional[SmokingStatus] = None
    alcohol_consumption: Optional[AlcoholConsumption] = None
    role: Optional[UserRole] = None
    user_status: Optional[UserStatus] 
    updated_by: Optional[EmailStr]  

    class Config:
        orm_mode = True

class UserOut(BaseModel):
    id: UUID
    email: EmailStr
    role: UserRole
    full_name: Optional[str] = None
    gender: Optional[Gender] = None
    dob: Optional[date] = None
    nationality: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    occupation: Optional[str] = None
    marital_status: Optional[MaritalStatus] = None
    sleep_hours: Optional[float] = None
    exercise_frequency: Optional[ExerciseFrequency] = None
    smoking_status: Optional[SmokingStatus] = None
    alcohol_consumption: Optional[AlcoholConsumption] = None
    user_status: Optional[UserStatus] = None

    model_config = {"from_attributes": True}