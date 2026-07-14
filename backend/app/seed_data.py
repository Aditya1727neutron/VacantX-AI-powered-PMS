"""
Seed the database with initial parking slot data.
Creates a university parking lot with 4 zones (A-D), 60 total slots,
and a default admin user.
"""
from .database import SessionLocal
from .models.slot import ParkingSlot
from .models.user import User
import bcrypt
import random

def hash_pw(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# Parking lot layout:
# Zone A (top-left):     15 slots, nearest to Gate 1
# Zone B (top-right):    15 slots, nearest to Gate 2
# Zone C (bottom-left):  15 slots, between Gate 1 and 3
# Zone D (bottom-right): 15 slots, nearest to Gate 3

ZONE_LAYOUTS = {
    "A": {"x_start": 10, "y_start": 10, "cols": 5, "rows": 3},
    "B": {"x_start": 60, "y_start": 10, "cols": 5, "rows": 3},
    "C": {"x_start": 10, "y_start": 60, "cols": 5, "rows": 3},
    "D": {"x_start": 60, "y_start": 60, "cols": 5, "rows": 3},
}

def seed_database():
    """Populate the database with initial parking data."""
    db = SessionLocal()
    
    try:
        # Check if already seeded
        existing = db.query(ParkingSlot).count()
        if existing > 0:
            print(f"[OK] Database already has {existing} slots. Skipping seed.")
            return
        
        print("[SEED] Seeding database...")
        
        # Create parking slots
        slot_count = 0
        for zone, layout in ZONE_LAYOUTS.items():
            for row in range(layout["rows"]):
                for col in range(layout["cols"]):
                    slot_num = row * layout["cols"] + col + 1
                    label = f"{zone}-{slot_num:02d}"
                    
                    x_pos = layout["x_start"] + col * 8
                    y_pos = layout["y_start"] + row * 12
                    
                    # Some slots start as occupied for realism
                    status = "occupied" if random.random() < 0.4 else "available"
                    
                    # Make a couple slots handicap/EV
                    slot_type = "standard"
                    if slot_num == 1:
                        slot_type = "handicap"
                    elif slot_num == 2:
                        slot_type = "ev"
                    
                    slot = ParkingSlot(
                        label=label,
                        zone=zone,
                        floor=1,
                        slot_type=slot_type,
                        x_pos=x_pos,
                        y_pos=y_pos,
                        status=status,
                        is_active=True
                    )
                    db.add(slot)
                    slot_count += 1
        
        # Create default admin user
        admin_exists = db.query(User).filter(User.username == "admin").first()
        if not admin_exists:
            admin = User(
                username="admin",
                email="admin@smartparking.com",
                hashed_password=hash_pw("admin123"),
                role="admin"
            )
            db.add(admin)
            print("[USER] Created admin user (admin / admin123)")
        
        # Create demo user
        demo_exists = db.query(User).filter(User.username == "student").first()
        if not demo_exists:
            demo = User(
                username="student",
                email="student@university.edu",
                hashed_password=hash_pw("student123"),
                role="user"
            )
            db.add(demo)
            print("[USER] Created demo user (student / student123)")
        
        db.commit()
        print(f"[OK] Seeded {slot_count} parking slots across {len(ZONE_LAYOUTS)} zones")
    
    except Exception as e:
        print(f"[ERROR] Seed error: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
