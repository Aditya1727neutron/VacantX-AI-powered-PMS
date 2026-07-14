/**
 * Parking API — All REST API calls to the backend.
 */
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000, // 10 second timeout
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.warn('⚠️ Backend server not reachable at', API_BASE);
    }
    return Promise.reject(error);
  }
);

// --- Parking Slots ---
export const getSlots = () => api.get('/slots');
export const getSlotById = (id) => api.get(`/slots/${id}`);
export const getSlotsByZone = (zone) => api.get(`/slots?zone=${zone}`);
export const updateSlotStatus = (id, status) =>
  api.put(`/slots/${id}/status`, { status });
export const bulkUpdateSlots = (updates) =>
  api.post('/slots/bulk-update', updates);
export const getSlotStats = () => api.get('/slots/stats');
export const getRecentLogs = (limit = 50) =>
  api.get(`/slots/logs/recent?limit=${limit}`);

// --- Recommendation ---
export const getRecommendation = (gate, preferredZone = null) =>
  api.post('/recommend', { gate, preferred_zone: preferredZone });
export const getGates = () => api.get('/gates');

// --- Prediction ---
export const getPredictions = (date, hourStart = 6, hourEnd = 22) =>
  api.get(`/predict?date=${date}&hour_start=${hourStart}&hour_end=${hourEnd}`);

// --- Auth ---
export const login = (username, password) =>
  api.post('/auth/login', { username, password });
export const register = (username, email, password) =>
  api.post('/auth/register', { username, email, password });
export const getMe = () => api.get('/auth/me');

// --- Admin ---
export const getAdminDashboard = () => api.get('/admin/dashboard');
export const simulateParking = () => api.post('/admin/simulate');
export const resetAllSlots = () => api.post('/admin/reset');

export default api;
