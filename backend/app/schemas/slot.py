"""
Pydantic schemas for parking slots.
"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SlotBase(BaseModel):
    label: str
    zone: str
    floor: int = 1
    slot_type: str = "standard"
    x_pos: float
    y_pos: float

class SlotCreate(SlotBase):
    pass

class SlotStatusUpdate(BaseModel):
    status: str  # "available" or "occupied"

class SlotResponse(SlotBase):
    id: int
    status: str
    is_active: bool
    updated_at: Optional[datetime] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class SlotStats(BaseModel):
    total_slots: int
    available: int
    occupied: int
    occupancy_rate: float
    zones: dict

class RecommendationRequest(BaseModel):
    gate: str  # "gate_1", "gate_2", "gate_3"
    preferred_zone: Optional[str] = None

class RecommendationResponse(BaseModel):
    recommended_slot: Optional[SlotResponse] = None
    distance: Optional[float] = None
    alternatives: list = []
    message: str
