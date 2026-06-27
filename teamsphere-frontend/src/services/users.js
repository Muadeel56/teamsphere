import api from './api';
import { getListFromResponse } from '../lib/apiList';

export const getUsers = () => api.get('/users/');
export const updateUserRole = (id, role) => api.patch(`/users/${id}/`, { role });

export async function getUsersList() {
  const res = await getUsers();
  return getListFromResponse(res.data);
}
