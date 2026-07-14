"""
Parking service — business logic for slot operations.
"""
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..models.slot import ParkingSlot
from ..models.log import ParkingLog

def get_all_slots(db: Session):
    return db.query(ParkingSlot).filter(ParkingSlot.is_active == True).all()

def get_slot_by_id(db: Session, slot_id: int):
    return db.query(ParkingSlot).filter(ParkingSlot.id == slot_id).first()

def get_slots_by_zone(db: Session, zone: str):
    return db.query(ParkingSlot).filter(
        ParkingSlot.zone == zone,
        ParkingSlot.is_active == True
    ).all()

def update_slot_status(db: Session, slot_id: int, new_status: str):
    slot = db.query(ParkingSlot).filter(ParkingSlot.id == slot_id).first()
    if not slot:
        return None
    
    old_status = slot.status
    slot.status = new_status
    
    # Log the change
    log = ParkingLog(
        slot_id=slot.id,
        slot_label=slot.label,
        zone=slot.zone,
        previous_status=old_status,
        new_status=new_status
    )
    db.add(log)
    db.commit()
    db.refresh(slot)
    return slot

def get_stats(db: Session):
    total = db.query(ParkingSlot).filter(ParkingSlot.is_active == True).count()
    available = db.query(ParkingSlot).filter(
        ParkingSlot.is_active == True,
        ParkingSlot.status == "available"
    ).count()
    occupied = total - available
    
    # Per-zone stats
    zones = {}
    zone_names = db.query(ParkingSlot.zone).distinct().all()
    for (zone_name,) in zone_names:
        zone_total = db.query(ParkingSlot).filter(
            ParkingSlot.zone == zone_name,
            ParkingSlot.is_active == True
        ).count()
        zone_available = db.query(ParkingSlot).filter(
            ParkingSlot.zone == zone_name,
            ParkingSlot.is_active == True,
            ParkingSlot.status == "available"
        ).count()
        zones[zone_name] = {
            "total": zone_total,
            "available": zone_available,
            "occupied": zone_total - zone_available,
            "occupancy_rate": round(((zone_total - zone_available) / zone_total * 100), 1) if zone_total > 0 else 0
        }
    
    return {
        "total_slots": total,
        "available": available,
        "occupied": occupied,
        "occupancy_rate": round((occupied / total * 100), 1) if total > 0 else 0,
        "zones": zones
    }

def get_logs(db: Session, limit: int = 50):
    return db.query(ParkingLog).order_by(ParkingLog.timestamp.desc()).limit(limit).all()

def bulk_update_status(db: Session, updates: list):
    """Update multiple slots at once. updates = [{"id": 1, "status": "occupied"}, ...]"""
    results = []
    for update in updates:
        slot = update_slot_status(db, update["id"], update["status"])
        if slot:
            results.append(slot)
    return results
