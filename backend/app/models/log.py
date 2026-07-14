"""
ParkingLog ORM model — records slot status changes.
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..database import Base

class ParkingLog(Base):
    __tablename__ = "parking_logs"

    id = Column(Integer, primary_key=True, index=True)
    slot_id = Column(Integer, ForeignKey("parking_slots.id"))
    slot_label = Column(String)
    zone = Column(String)
    previous_status = Column(String)
    new_status = Column(String)
    timestamp = Column(DateTime, server_default=func.now())
