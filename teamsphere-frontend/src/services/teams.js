import api from './api';
import { getListFromResponse } from '../lib/apiList';
import { buildUserMap, enrichTeams } from '../lib/teamHelpers';
import { getUsersList, updateUserRole } from './users';

export const getTeams = () => api.get('/teams/');
export const getTeam = (id) => api.get(`/teams/${id}/`);
export const createTeam = (data) => api.post('/teams/', data);
export const updateTeam = (id, data) => api.patch(`/teams/${id}/`, data);
export const deleteTeam = (id) => api.delete(`/teams/${id}/`);
export const inviteTeamMember = (teamId, data) =>
  api.post(`/teams/${teamId}/invite/`, data);

export async function addTeamMember(teamId, userId) {
  const res = await getTeam(teamId);
  const team = res.data;
  const memberIds = (team.members ?? []).map((m) => (typeof m === 'object' ? m.id : m));
  if (memberIds.includes(userId)) return res;
  return updateTeam(teamId, { members: [...memberIds, userId] });
}

export async function removeTeamMember(teamId, userId) {
  const res = await getTeam(teamId);
  const team = res.data;
  const memberIds = (team.members ?? [])
    .map((m) => (typeof m === 'object' ? m.id : m))
    .filter((id) => id !== userId);
  return updateTeam(teamId, { members: memberIds });
}

export function updateMemberRole(userId, role) {
  return updateUserRole(userId, role);
}

export async function getTeamsPageData(currentUser) {
  const [teamsRes, allUsers] = await Promise.all([
    getTeams(),
    getUsersList().catch(() => []),
  ]);

  const teams = getListFromResponse(teamsRes.data);
  const userMap = buildUserMap(currentUser, teams, allUsers);

  return {
    teams: enrichTeams(teams, userMap),
    userMap,
    allUsers,
  };
}
