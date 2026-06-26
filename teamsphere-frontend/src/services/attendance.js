import api from './api';

export const getAttendance = () => api.get('/attendance/');
export const checkIn = (data) => api.post('/attendance/check-in/', data);
export const checkOut = (data) => api.post('/attendance/check-out/', data); 