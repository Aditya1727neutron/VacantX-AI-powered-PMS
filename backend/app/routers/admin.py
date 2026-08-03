"""
Admin router — slot management and analytics for admin users.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.slot import ParkingSlot
from ..models.user import User
from ..routers.auth import get_current_user
from ..services.parking_service import get_stats, get_logs
from ..websocket.events import broadcast_slot_update
import random

router = APIRouter(prefix="/api/admin", tags=["Admin"])

def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


@router.get("/dashboard")
def admin_dashboard(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    """Admin dashboard with stats and recent logs."""
    stats = get_stats(db)
    logs = get_logs(db, limit=20)
    
    return {
        "stats": stats,
        "recent_logs": [
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
    }


@router.post("/simulate")
async def simulate_parking(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    """Simulate random parking changes for demo purposes."""
    slots = db.query(ParkingSlot).filter(ParkingSlot.is_active == True).all()
    if not slots:
        return {"message": "No slots to simulate"}
    
    # Randomly change 5-10 slots
    num_changes = min(random.randint(5, 10), len(slots))
    changed_slots = random.sample(slots, num_changes)
    
    updates = []
    for slot in changed_slots:
        new_status = "occupied" if slot.status == "available" else "available"
        slot.status = new_status
        updates.append({
            "id": slot.id,
            "label": slot.label,
            "zone": slot.zone,
            "status": new_status,
            "x_pos": slot.x_pos,
            "y_pos": slot.y_pos
        })
    
    db.commit()
    
    # Broadcast all changes
    for update in updates:
        await broadcast_slot_update(update)
    
    return {"simulated_changes": len(updates), "updates": updates}


@router.post("/reset")
async def reset_all_slots(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    """Reset all slots to available."""
    slots = db.query(ParkingSlot).all()
    for slot in slots:
        slot.status = "available"
    db.commit()
    
    for slot in slots:
        await broadcast_slot_update({
            "id": slot.id,
            "label": slot.label,
            "zone": slot.zone,
            "status": "available",
            "x_pos": slot.x_pos,
            "y_pos": slot.y_pos
        })
    
    return {"message": f"Reset {len(slots)} slots to available"}
