import api from './api';
import { getListFromResponse } from '../lib/apiList';
import { getProjects } from './projects';
import { getTeams } from './teams';
import { buildUserMap } from '../lib/projectHelpers';

export const getTasks = () => api.get('/tasks/');
export const createTask = (data) => api.post('/tasks/', data);
export const updateTask = (id, data) => api.patch(`/tasks/${id}/`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}/`);

export async function getTasksPageData(currentUser) {
  const [tasksRes, projectsRes, teamsRes] = await Promise.all([
    getTasks(),
    getProjects(),
    getTeams(),
  ]);

  return {
    tasks: getListFromResponse(tasksRes.data),
    projects: getListFromResponse(projectsRes.data),
    userMap: buildUserMap(currentUser, getListFromResponse(teamsRes.data)),
  };
}
