import api from './api';

export const getProjects = () => api.get('/projects/');
export const createProject = (data) => api.post('/projects/', data); 