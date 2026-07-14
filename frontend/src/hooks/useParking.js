import { useState, useEffect, useCallback, useRef } from 'react';
import { getSlots, getSlotStats } from '../api/parkingAPI';
import { connectWebSocket, addSocketListener, disconnectWebSocket } from '../api/socket';

/**
 * Hook to manage parking slot data with real-time WebSocket updates.
 * Gracefully handles backend being unavailable.
 */
export function useParking() {
  const [slots, setSlots] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const fetchSlots = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [slotsRes, statsRes] = await Promise.all([
        getSlots(),
        getSlotStats(),
      ]);
      if (mountedRef.current) {
        setSlots(slotsRes.data);
        setStats(statsRes.data);
        setError(null);
      }
    } catch (err) {
      if (mountedRef.current) {
        if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
          setError('Backend server is not running. Please start the backend server on port 8000.');
        } else {
          setError('Failed to fetch parking data. Please check your connection.');
        }
        console.error('Parking fetch error:', err.message);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchSlots();

    // Connect WebSocket for real-time updates
    connectWebSocket();
    const unsubscribe = addSocketListener((message) => {
      if (!mountedRef.current) return;

      if (message.type === 'slot_update') {
        const updated = message.data;
        setSlots((prev) =>
          prev.map((s) => (s.id === updated.id ? { ...s, ...updated } : s))
        );
        // Refresh stats on updates
        getSlotStats()
          .then((res) => {
            if (mountedRef.current) setStats(res.data);
          })
          .catch(() => {});
      }
      if (message.type === 'stats_update') {
        setStats(message.data);
      }
    });

    return () => {
      mountedRef.current = false;
      unsubscribe();
    };
  }, [fetchSlots]);

  return { slots, stats, loading, error, refetch: fetchSlots };
}
