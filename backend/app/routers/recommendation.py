"""
Recommendation router — nearest available slot finder.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.slot import RecommendationRequest, RecommendationResponse, SlotResponse
from ..services.recommendation_service import get_nearest_slot, get_gates

router = APIRouter(prefix="/api", tags=["Recommendation"])

@router.post("/recommend", response_model=RecommendationResponse)
def recommend_slot(req: RecommendationRequest, db: Session = Depends(get_db)):
    """Recommend the nearest available parking slot for a given gate."""
    slot, distance, alternatives, message = get_nearest_slot(
        db, req.gate, req.preferred_zone
    )
    
    alt_list = []
    for alt in alternatives:
        alt_slot = alt["slot"]
        alt_list.append({
            "id": alt_slot.id,
            "label": alt_slot.label,
            "zone": alt_slot.zone,
            "distance": alt["distance"]
        })
    
    return RecommendationResponse(
        recommended_slot=slot,
        distance=distance,
        alternatives=alt_list,
        message=message
    )

@router.get("/gates")
def list_gates():
    """List all entry gates and their coordinates."""
    return get_gates()
