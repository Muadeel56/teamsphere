import api from './api';
import { getListFromResponse } from '../lib/apiList';
import { getTasks } from './tasks';
import { getTeams } from './teams';
import { buildUserMap, enrichProjects } from '../lib/projectHelpers';

export const getProjects = () => api.get('/projects/');
export const createProject = (data) => api.post('/projects/', data);
export const updateProject = (id, data) => api.patch(`/projects/${id}/`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}/`);

export async function getProjectsPageData(currentUser) {
  const [projectsRes, tasksRes, teamsRes] = await Promise.all([
    getProjects(),
    getTasks(),
    getTeams(),
  ]);

  const projects = getListFromResponse(projectsRes.data);
  const tasks = getListFromResponse(tasksRes.data);
  const teams = getListFromResponse(teamsRes.data);
  const userMap = buildUserMap(currentUser, teams);

  return {
    projects: enrichProjects(projects, tasks, userMap),
    userMap,
    teams,
  };
}
