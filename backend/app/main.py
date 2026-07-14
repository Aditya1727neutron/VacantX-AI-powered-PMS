"""
FastAPI main application entry point.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from .database import engine, Base
from .config import ALLOWED_ORIGINS
from .routers import parking, recommendation, prediction, auth, admin
from .websocket.events import connect, disconnect
from .seed_data import seed_database

# Create all tables
Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan — runs seed on startup."""
    seed_database()
    print("[OK] Smart Parking API is ready.")
    yield
    print("[OK] Smart Parking API shutting down.")


app = FastAPI(
    title="Smart Parking API",
    description="AI-Based Parking Slot Detection and Navigation System",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(parking.router)
app.include_router(recommendation.router)
app.include_router(prediction.router)
app.include_router(auth.router)
app.include_router(admin.router)


# WebSocket endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle incoming messages if needed
    except WebSocketDisconnect:
        disconnect(websocket)
    except Exception:
        disconnect(websocket)


@app.get("/")
def root():
    return {
        "name": "Smart Parking API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running"
    }


@app.get("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
