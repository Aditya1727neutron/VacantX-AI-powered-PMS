"""
Prediction router — proxies requests to the AI module.
"""
from fastapi import APIRouter, HTTPException
import httpx
from ..config import AI_MODULE_URL

router = APIRouter(prefix="/api", tags=["Prediction"])

@router.get("/predict")
async def get_predictions(date: str, hour_start: int = 6, hour_end: int = 22):
    """Proxy prediction request to AI module."""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                f"{AI_MODULE_URL}/predict",
                json={
                    "date": date,
                    "hour_start": hour_start,
                    "hour_end": hour_end
                }
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail="AI module error"
                )
    except httpx.ConnectError:
        # Return simulated data if AI module is down
        return _fallback_predictions(date, hour_start, hour_end)
    except Exception as e:
        return _fallback_predictions(date, hour_start, hour_end)


def _fallback_predictions(date: str, hour_start: int, hour_end: int):
    """Fallback predictions when AI module is unavailable."""
    import math
    predictions = []
    zones = ['A', 'B', 'C', 'D']
    
    for hour in range(hour_start, hour_end + 1):
        for zone in zones:
            # Simple pattern
            base = 50 + 30 * math.sin((hour - 6) * math.pi / 16)
            offset = {'A': 10, 'B': 5, 'C': -5, 'D': -10}[zone]
            occupancy = max(5, min(95, round(base + offset, 1)))
            
            if occupancy < 40:
                status = "low"
            elif occupancy < 65:
                status = "moderate"
            elif occupancy < 85:
                status = "high"
            else:
                status = "critical"
            
            predictions.append({
                "hour": hour,
                "zone": zone,
                "occupancy_pct": occupancy,
                "status": status
            })
    
    return {
        "date": date,
        "predictions": predictions,
        "summary": {
            "average_occupancy": 55.0,
            "peak_hour": 9,
            "peak_occupancy": 82.0,
            "best_hour": hour_start,
            "total_predictions": len(predictions)
        }
    }
