import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});

api.interceptors.request.use((config) => {
  let token = null;
  try {
    token = useAuthStore.getState().token;
  } catch {}
  if (!token) token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Add interceptors for JWT and error handling here
// api.interceptors.request.use(...)
// api.interceptors.response.use(...)

export default api; 