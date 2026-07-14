"""
ParkingSlot ORM model.
"""
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.sql import func
from ..database import Base

class ParkingSlot(Base):
    __tablename__ = "parking_slots"

    id = Column(Integer, primary_key=True, index=True)
    label = Column(String, unique=True, index=True)  # e.g., "A-01"
    zone = Column(String, index=True)  # A, B, C, D
    floor = Column(Integer, default=1)
    slot_type = Column(String, default="standard")  # standard, handicap, ev
    x_pos = Column(Float)  # X coordinate on map
    y_pos = Column(Float)  # Y coordinate on map
    status = Column(String, default="available")  # available, occupied
    is_active = Column(Boolean, default=True)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    created_at = Column(DateTime, server_default=func.now())
