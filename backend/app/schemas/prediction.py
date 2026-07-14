"""
Pydantic schemas for prediction API.
"""
from pydantic import BaseModel
from typing import List

class PredictionRequest(BaseModel):
    date: str
    hour_start: int = 6
    hour_end: int = 22

class ZonePrediction(BaseModel):
    hour: int
    zone: str
    occupancy_pct: float
    status: str

class PredictionSummary(BaseModel):
    average_occupancy: float
    peak_hour: int
    peak_occupancy: float
    best_hour: int
    total_predictions: int

class PredictionResponse(BaseModel):
    date: str
    predictions: List[ZonePrediction]
    summary: PredictionSummary
