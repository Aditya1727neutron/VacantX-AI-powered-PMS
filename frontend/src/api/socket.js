/**
 * WebSocket connection for real-time slot updates.
 * Uses exponential backoff to prevent connection spam.
 */
const WS_URL = 'ws://localhost:8000/ws';

let ws = null;
let reconnectTimer = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_DELAY = 30000; // 30 seconds max
const BASE_RECONNECT_DELAY = 2000; // 2 seconds base
let listeners = [];
let isIntentionalClose = false;

function getReconnectDelay() {
  // Exponential backoff: 2s, 4s, 8s, 16s, 30s, 30s...
  const delay = Math.min(
    BASE_RECONNECT_DELAY * Math.pow(2, reconnectAttempts),
    MAX_RECONNECT_DELAY
  );
  return delay;
}

export function connectWebSocket() {
  if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
    return;
  }

  isIntentionalClose = false;

  try {
    ws = new WebSocket(WS_URL);
  } catch (err) {
    // If WebSocket constructor fails, schedule a retry
    scheduleReconnect();
    return;
  }

  ws.onopen = () => {
    console.log('🔌 WebSocket connected');
    reconnectAttempts = 0; // Reset backoff on successful connection
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  };

  ws.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      listeners.forEach((cb) => cb(message));
    } catch (err) {
      // Silently ignore parse errors
    }
  };

  ws.onclose = () => {
    if (!isIntentionalClose) {
      scheduleReconnect();
    }
  };

  ws.onerror = () => {
    // Don't log errors to avoid console spam — onclose will handle reconnection
    if (ws) {
      ws.close();
    }
  };
}

function scheduleReconnect() {
  if (reconnectTimer) return; // Already scheduled

  const delay = getReconnectDelay();
  reconnectAttempts++;

  if (reconnectAttempts <= 3) {
    console.log(`🔌 WebSocket reconnecting in ${delay / 1000}s...`);
  }

  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    connectWebSocket();
  }, delay);
}

export function addSocketListener(callback) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((cb) => cb !== callback);
  };
}

export function disconnectWebSocket() {
  isIntentionalClose = true;
  if (ws) {
    ws.close();
    ws = null;
  }
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  reconnectAttempts = 0;
  listeners = [];
}
