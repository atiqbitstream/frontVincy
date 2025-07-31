import uuid
from app.db.base import Base
from sqlalchemy import Boolean, Column, DateTime, Float, String, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func


class Sound(Base):
    __tablename__ = "sounds"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    sound = Column(Boolean, nullable=False, default=False)  # 1/0 as bit
    user_email = Column(String, ForeignKey("users.email"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_by = Column(String, nullable=True)
    updated_by = Column(String, nullable=True)


class Steam(Base):
    __tablename__ = "steams"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    steam = Column(Boolean, nullable=False, default=False)  # 1/0 as bit
    user_email = Column(String, ForeignKey("users.email"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_by = Column(String, nullable=True)
    updated_by = Column(String, nullable=True)


class TempTank(Base):
    __tablename__ = "temp_tanks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    temp_tank = Column(Float, nullable=False)  # temperature in celsius
    user_email = Column(String, ForeignKey("users.email"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_by = Column(String, nullable=True)
    updated_by = Column(String, nullable=True)


class WaterPump(Base):
    __tablename__ = "water_pumps"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    water_pump = Column(Boolean, nullable=False, default=False)  # 1/0 as bit
    user_email = Column(String, ForeignKey("users.email"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_by = Column(String, nullable=True)
    updated_by = Column(String, nullable=True)


class NanoFlicker(Base):
    __tablename__ = "nano_flickers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    nano_flicker = Column(Boolean, nullable=False, default=False)  # 1/0 as bit
    user_email = Column(String, ForeignKey("users.email"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_by = Column(String, nullable=True)
    updated_by = Column(String, nullable=True)


class LedColor(Base):
    __tablename__ = "led_colors"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    led_color = Column(String, nullable=False)  # red, green, blue, etc.
    user_email = Column(String, ForeignKey("users.email"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_by = Column(String, nullable=True)
    updated_by = Column(String, nullable=True)
