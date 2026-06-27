import api from './api';
import { getListFromResponse } from '../lib/apiList';
import {
  buildWeeklyGrid,
  computeSummary,
  findActiveSession,
  getTableWeekStart,
  getWeekRange,
} from '../lib/attendanceHelpers';
import { getUsersList } from './users';

export const getAttendance = (params) => api.get('/attendance/', { params });
export const checkIn = () => api.post('/attendance/check-in/');
export const checkOut = () => api.post('/attendance/check-out/');

export async function fetchAllAttendance(params = {}) {
  const records = [];
  let page = 1;

  while (true) {
    const res = await api.get('/attendance/', { params: { ...params, page } });
    records.push(...getListFromResponse(res.data));
    if (!res.data?.next) break;
    page += 1;
  }

  return records;
}

function buildAttendanceUserMap(currentUser, allUsers) {
  const userMap = {};
  for (const user of allUsers) {
    if (user?.id) userMap[user.id] = user;
  }
  if (currentUser?.id) {
    userMap[currentUser.id] = { ...userMap[currentUser.id], ...currentUser };
  }
  return userMap;
}

export async function getAttendancePageData(currentUser, { preset = 'week' } = {}) {
  const range = getWeekRange(preset);
  const { start, end } = range;

  const [records, allUsers] = await Promise.all([
    fetchAllAttendance({ start_date: start, end_date: end }),
    getUsersList().catch(() => []),
  ]);

  const userMap = buildAttendanceUserMap(currentUser, allUsers);
  const users = Object.values(userMap).sort((a, b) => a.id - b.id);

  const weekStart = getTableWeekStart(end);
  const weeklyGrid = buildWeeklyGrid(records, users, weekStart);
  const summary = computeSummary(records, users, range);
  const activeSession = currentUser?.id
    ? findActiveSession(records, currentUser.id)
    : null;

  return {
    records,
    userMap,
    weeklyGrid,
    summary,
    activeSession,
    range,
  };
}
