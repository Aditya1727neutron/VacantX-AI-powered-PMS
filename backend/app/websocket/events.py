"""
WebSocket event broadcasting for real-time slot updates.
"""
from fastapi import WebSocket
from typing import List
import json

# Active WebSocket connections
active_connections: List[WebSocket] = []

async def connect(websocket: WebSocket):
    """Accept and register a new WebSocket connection."""
    await websocket.accept()
    active_connections.append(websocket)
    print(f"[WS] Client connected. Total: {len(active_connections)}")

def disconnect(websocket: WebSocket):
    """Remove a WebSocket connection."""
    if websocket in active_connections:
        active_connections.remove(websocket)
    print(f"[WS] Client disconnected. Total: {len(active_connections)}")

async def broadcast_slot_update(slot_data: dict):
    """Broadcast slot status change to all connected clients."""
    message = json.dumps({
        "type": "slot_update",
        "data": slot_data
    })
    
    disconnected = []
    for connection in active_connections:
        try:
            await connection.send_text(message)
        except Exception:
            disconnected.append(connection)
    
    # Clean up broken connections
    for conn in disconnected:
        disconnect(conn)

async def broadcast_stats(stats: dict):
    """Broadcast updated stats to all connected clients."""
    message = json.dumps({
        "type": "stats_update",
        "data": stats
    })
    
    disconnected = []
    for connection in active_connections:
        try:
            await connection.send_text(message)
        except Exception:
            disconnected.append(connection)
    
    for conn in disconnected:
        disconnect(conn)
