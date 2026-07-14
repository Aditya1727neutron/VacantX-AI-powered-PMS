"""
Generate synthetic historical parking data for model training.
Creates realistic university parking patterns with:
- Peak hours (8-10 AM, 12-2 PM)
- Day-of-week variations
- Semester vs break patterns
"""
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

def generate_parking_data(num_days=180, num_slots=60):
    """Generate synthetic parking log data."""
    np.random.seed(42)
    
    zones = ['A', 'B', 'C', 'D']
    slots_per_zone = num_slots // len(zones)
    
    records = []
    start_date = datetime(2025, 1, 1)
    
    for day_offset in range(num_days):
        current_date = start_date + timedelta(days=day_offset)
        day_of_week = current_date.weekday()  # 0=Monday, 6=Sunday
        
        # Skip Sundays (lower activity)
        is_weekend = day_of_week >= 5
        
        # Semester effect (Jan-May high, Jun-Jul low, Aug-Dec high)
        month = current_date.month
        is_semester = month in [1, 2, 3, 4, 5, 8, 9, 10, 11, 12]
        semester_factor = 1.0 if is_semester else 0.4
        
        for hour in range(6, 22):  # 6 AM to 10 PM
            for zone_idx, zone in enumerate(zones):
                # Base occupancy pattern by hour
                if 8 <= hour <= 10:
                    base_occupancy = 0.85  # Morning rush
                elif 11 <= hour <= 13:
                    base_occupancy = 0.75  # Midday
                elif 14 <= hour <= 16:
                    base_occupancy = 0.70  # Afternoon
                elif 17 <= hour <= 19:
                    base_occupancy = 0.60  # Evening departure
                elif hour >= 20:
                    base_occupancy = 0.25  # Night
                else:
                    base_occupancy = 0.35  # Early morning
                
                # Zone proximity factor (Zone A near main building = busier)
                zone_factors = {'A': 1.15, 'B': 1.0, 'C': 0.90, 'D': 0.80}
                zone_factor = zone_factors[zone]
                
                # Weekend reduction
                weekend_factor = 0.35 if is_weekend else 1.0
                
                # Calculate occupancy
                occupancy = base_occupancy * zone_factor * weekend_factor * semester_factor
                occupancy = min(occupancy, 0.98)  # Cap at 98%
                
                # Add noise
                noise = np.random.normal(0, 0.08)
                occupancy = np.clip(occupancy + noise, 0.05, 0.98)
                
                occupied_count = int(occupancy * slots_per_zone)
                available_count = slots_per_zone - occupied_count
                
                records.append({
                    'date': current_date.strftime('%Y-%m-%d'),
                    'hour': hour,
                    'day_of_week': day_of_week,
                    'month': month,
                    'zone': zone,
                    'total_slots': slots_per_zone,
                    'occupied': occupied_count,
                    'available': available_count,
                    'occupancy_pct': round(occupancy * 100, 1),
                    'is_weekend': int(is_weekend),
                    'is_semester': int(is_semester)
                })
    
    df = pd.DataFrame(records)
    
    # Save to CSV
    data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
    os.makedirs(data_dir, exist_ok=True)
    filepath = os.path.join(data_dir, 'parking_logs.csv')
    df.to_csv(filepath, index=False)
    print(f"Generated {len(df)} records -> {filepath}")
    return df

if __name__ == '__main__':
    df = generate_parking_data()
    print(f"\nSample data:\n{df.head(10)}")
    print(f"\nOccupancy stats:\n{df['occupancy_pct'].describe()}")
