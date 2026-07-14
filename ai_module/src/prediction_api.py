"""
AI Prediction Microservice — FastAPI
Serves occupancy predictions from the trained Random Forest model.
Endpoints:
  POST /predict — Predict occupancy for a date/time range
  GET  /health  — Health check
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import numpy as np
import joblib
import os
import uvicorn
from datetime import datetime

app = FastAPI(title="Smart Parking AI Module", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Load model at startup ---
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'occupancy_model.pkl')
ENCODER_PATH = os.path.join(BASE_DIR, 'models', 'zone_encoder.pkl')

model = None
zone_encoder = None

@app.on_event("startup")
def load_model():
    global model, zone_encoder
    if os.path.exists(MODEL_PATH) and os.path.exists(ENCODER_PATH):
        model = joblib.load(MODEL_PATH)
        zone_encoder = joblib.load(ENCODER_PATH)
        print("[OK] Model loaded successfully")
    else:
        print("[WARN] Model not found. Run train_model.py first.")
        print("  Attempting to generate data and train model...")
        try:
            import sys
            sys.path.insert(0, os.path.dirname(__file__))
            from preprocess import generate_parking_data
            from train_model import train_model
            generate_parking_data()
            model_result, encoder_result = train_model()
            model = model_result
            zone_encoder = encoder_result
            print("[OK] Model trained and loaded on startup")
        except Exception as e:
            print(f"[ERROR] Failed to train model: {e}")


# --- Schemas ---
class PredictionRequest(BaseModel):
    date: str  # YYYY-MM-DD
    hour_start: int = 6
    hour_end: int = 22

class ZonePrediction(BaseModel):
    hour: int
    zone: str
    occupancy_pct: float
    status: str  # low, moderate, high, critical

class PredictionResponse(BaseModel):
    date: str
    predictions: List[ZonePrediction]
    summary: dict


# --- Endpoints ---
@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "timestamp": datetime.now().isoformat()
    }


@app.post("/predict", response_model=PredictionResponse)
def predict_occupancy(req: PredictionRequest):
    if model is None or zone_encoder is None:
        # Return simulated predictions if model not loaded
        return _simulated_predictions(req)
    
    target_date = datetime.strptime(req.date, '%Y-%m-%d')
    day_of_week = target_date.weekday()
    month = target_date.month
    is_weekend = int(day_of_week >= 5)
    is_semester = int(month in [1, 2, 3, 4, 5, 8, 9, 10, 11, 12])
    
    zones = zone_encoder.classes_
    predictions = []
    
    for hour in range(req.hour_start, req.hour_end + 1):
        for zone in zones:
            zone_encoded = zone_encoder.transform([zone])[0]
            features = np.array([[hour, day_of_week, month, zone_encoded, is_weekend, is_semester]])
            occupancy = float(model.predict(features)[0])
            occupancy = max(0, min(100, round(occupancy, 1)))
            
            # Determine status
            if occupancy < 40:
                status = "low"
            elif occupancy < 65:
                status = "moderate"
            elif occupancy < 85:
                status = "high"
            else:
                status = "critical"
            
            predictions.append(ZonePrediction(
                hour=hour,
                zone=zone,
                occupancy_pct=occupancy,
                status=status
            ))
    
    # Summary
    avg_occupancy = np.mean([p.occupancy_pct for p in predictions])
    peak_hour_data = {}
    for p in predictions:
        if p.hour not in peak_hour_data:
            peak_hour_data[p.hour] = []
        peak_hour_data[p.hour].append(p.occupancy_pct)
    
    peak_hour = max(peak_hour_data.keys(), key=lambda h: np.mean(peak_hour_data[h]))
    
    summary = {
        "average_occupancy": round(avg_occupancy, 1),
        "peak_hour": peak_hour,
        "peak_occupancy": round(np.mean(peak_hour_data[peak_hour]), 1),
        "best_hour": min(peak_hour_data.keys(), key=lambda h: np.mean(peak_hour_data[h])),
        "total_predictions": len(predictions)
    }
    
    return PredictionResponse(date=req.date, predictions=predictions, summary=summary)


def _simulated_predictions(req: PredictionRequest) -> PredictionResponse:
    """Fallback simulated predictions when model is not loaded."""
    zones = ['A', 'B', 'C', 'D']
    predictions = []
    
    for hour in range(req.hour_start, req.hour_end + 1):
        for zone in zones:
            # Simple sinusoidal pattern
            base = 50 + 30 * np.sin((hour - 6) * np.pi / 16)
            zone_offset = {'A': 10, 'B': 5, 'C': -5, 'D': -10}[zone]
            noise = np.random.normal(0, 3)
            occupancy = max(5, min(95, round(base + zone_offset + noise, 1)))
            
            if occupancy < 40:
                status = "low"
            elif occupancy < 65:
                status = "moderate"
            elif occupancy < 85:
                status = "high"
            else:
                status = "critical"
            
            predictions.append(ZonePrediction(
                hour=hour, zone=zone, occupancy_pct=occupancy, status=status
            ))
    
    avg = np.mean([p.occupancy_pct for p in predictions])
    summary = {
        "average_occupancy": round(avg, 1),
        "peak_hour": 9,
        "peak_occupancy": 82.0,
        "best_hour": 6,
        "total_predictions": len(predictions)
    }
    
    return PredictionResponse(date=req.date, predictions=predictions, summary=summary)


if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=8001)
