"""
Recommendation service — finds nearest available parking slot.
Uses Euclidean distance from gate coordinates.
"""
import math
from sqlalchemy.orm import Session
from ..models.slot import ParkingSlot

# Gate coordinates on the parking map
GATE_COORDINATES = {
    "gate_1": {"x": 0, "y": 50, "name": "Main Gate (West)"},
    "gate_2": {"x": 100, "y": 0, "name": "North Gate"},
    "gate_3": {"x": 100, "y": 100, "name": "South Gate"},
}

def get_nearest_slot(db: Session, gate: str, preferred_zone: str = None):
    """Find nearest available slot to the specified gate."""
    if gate not in GATE_COORDINATES:
        return None, 0, [], f"Unknown gate: {gate}"
    
    gate_pos = GATE_COORDINATES[gate]
    
    # Get available slots
    query = db.query(ParkingSlot).filter(
        ParkingSlot.is_active == True,
        ParkingSlot.status == "available"
    )
    
    if preferred_zone:
        query = query.filter(ParkingSlot.zone == preferred_zone)
    
    available_slots = query.all()
    
    if not available_slots:
        return None, 0, [], "No available slots found"
    
    # Calculate distances
    slot_distances = []
    for slot in available_slots:
        distance = math.sqrt(
            (slot.x_pos - gate_pos["x"]) ** 2 + 
            (slot.y_pos - gate_pos["y"]) ** 2
        )
        slot_distances.append((slot, round(distance, 2)))
    
    # Sort by distance
    slot_distances.sort(key=lambda x: x[1])
    
    best_slot, best_distance = slot_distances[0]
    alternatives = [
        {"slot": s, "distance": d} 
        for s, d in slot_distances[1:4]  # Top 3 alternatives
    ]
    
    return best_slot, best_distance, alternatives, f"Nearest slot: {best_slot.label} ({best_distance:.1f}m from {GATE_COORDINATES[gate]['name']})"

def get_gates():
    """Return all available gates."""
    return GATE_COORDINATES
