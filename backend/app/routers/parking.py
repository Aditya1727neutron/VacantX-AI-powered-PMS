"""
Parking router — slot CRUD and status management.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..schemas.slot import SlotResponse, SlotStatusUpdate, SlotStats
from ..services.parking_service import (
    get_all_slots, get_slot_by_id, get_slots_by_zone,
    update_slot_status, get_stats, get_logs, bulk_update_status
)
from ..websocket.events import broadcast_slot_update

router = APIRouter(prefix="/api/slots", tags=["Parking"])

@router.get("/", response_model=List[SlotResponse])
def list_slots(zone: str = None, db: Session = Depends(get_db)):
    """Get all parking slots, optionally filtered by zone."""
    if zone:
        return get_slots_by_zone(db, zone)
    return get_all_slots(db)

@router.get("/stats")
def slot_stats(db: Session = Depends(get_db)):
    """Get parking statistics."""
    return get_stats(db)

@router.get("/{slot_id}", response_model=SlotResponse)
def get_slot(slot_id: int, db: Session = Depends(get_db)):
    """Get a single slot by ID."""
    slot = get_slot_by_id(db, slot_id)
    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found")
    return slot

@router.put("/{slot_id}/status", response_model=SlotResponse)
async def change_slot_status(slot_id: int, update: SlotStatusUpdate, db: Session = Depends(get_db)):
    """Update a slot's status (available/occupied)."""
    if update.status not in ("available", "occupied"):
        raise HTTPException(status_code=400, detail="Status must be 'available' or 'occupied'")
    
    slot = update_slot_status(db, slot_id, update.status)
    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found")
    
    # Broadcast update via WebSocket
    await broadcast_slot_update({
        "id": slot.id,
        "label": slot.label,
        "zone": slot.zone,
        "status": slot.status,
        "x_pos": slot.x_pos,
        "y_pos": slot.y_pos
    })
    
    return slot

@router.post("/bulk-update")
async def bulk_update(updates: list, db: Session = Depends(get_db)):
    """Bulk update multiple slot statuses."""
    results = bulk_update_status(db, updates)
    
    # Broadcast all updates
    for slot in results:
        await broadcast_slot_update({
            "id": slot.id,
            "label": slot.label,
            "zone": slot.zone,
            "status": slot.status,
            "x_pos": slot.x_pos,
            "y_pos": slot.y_pos
        })
    
    return {"updated": len(results)}

@router.get("/logs/recent")
def recent_logs(limit: int = 50, db: Session = Depends(get_db)):
    """Get recent parking activity logs."""
    logs = get_logs(db, limit)
    return [
        {
            "id": log.id,
            "slot_label": log.slot_label,
            "zone": log.zone,
            "previous_status": log.previous_status,
            "new_status": log.new_status,
            "timestamp": log.timestamp.isoformat() if log.timestamp else None
        }
        for log in logs
    ]
