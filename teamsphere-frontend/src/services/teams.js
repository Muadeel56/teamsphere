import api from './api';

export const getTeams = () => api.get('/teams/');
export const createTeam = (data) => api.post('/teams/', data); 