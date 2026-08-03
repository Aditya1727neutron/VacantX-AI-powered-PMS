/**
 * Parking API — All REST API calls to the backend.
 */
import axios from 'axios';

const API_BASE = 'https://vacantx-ai-powered-pms.onrender.com';

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
export const getSlots = () => api.get('/api/slots/');
export const getSlotById = (id) => api.get(`/api/slots/${id}`);
export const getSlotsByZone = (zone) => api.get(`/api/slots/?zone=${zone}`);
export const updateSlotStatus = (id, status) =>
  api.put(`/api/slots/${id}/status`, { status });
export const bulkUpdateSlots = (updates) =>
  api.post('/api/slots/bulk-update', updates);
export const getSlotStats = () => api.get('/api/slots/stats');
export const getRecentLogs = (limit = 50) =>
  api.get(`/api/slots/logs/recent?limit=${limit}`);

// --- Recommendation ---
export const getRecommendation = (gate, preferredZone = null) =>
  api.post('/api/recommend', { gate, preferred_zone: preferredZone });
export const getGates = () => api.get('/api/gates');

// --- Prediction ---
export const getPredictions = (date, hourStart = 6, hourEnd = 22) =>
  api.get(`/api/predict?date=${date}&hour_start=${hourStart}&hour_end=${hourEnd}`);

// --- Auth ---
export const login = (username, password) =>
  api.post('/api/auth/login', { username, password });

export const register = (username, email, password) =>
  api.post('/api/auth/register', { username, email, password });

export const getMe = () => api.get('/api/auth/me');

// --- Admin ---
export const getAdminDashboard = () => api.get('/api/admin/dashboard');
export const simulateParking = () => api.post('/api/admin/simulate');
export const resetAllSlots = () => api.post('/api/admin/reset');

export default api;
