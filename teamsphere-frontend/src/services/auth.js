import api from './api';

export const login = (data) => api.post('/auth/jwt/create/', data);
export const register = (data) => api.post('/auth/users/', data);
export const getCurrentUser = () => api.get('/auth/users/me/'); 