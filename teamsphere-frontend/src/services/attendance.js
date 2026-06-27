import api from './api';
import { getListFromResponse } from '../lib/apiList';
import {
  buildAttendanceGroups,
  buildHeatmapWeeks,
  computeAttendanceStats,
  findActiveSession,
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
    if (user?.id != null) userMap[Number(user.id)] = user;
  }
  if (currentUser?.id != null) {
    const id = Number(currentUser.id);
    userMap[id] = { ...userMap[id], ...currentUser, id };
  }
  return userMap;
}

function mergeUsersFromRecords(users, records, userMap) {
  const list = [...users];
  const knownIds = new Set(list.map((u) => Number(u.id)));

  for (const record of records) {
    const uid = typeof record.user === 'object' ? record.user?.id : record.user;
    if (uid == null || knownIds.has(Number(uid))) continue;

    const mapped = userMap[Number(uid)];
    list.push(
      mapped ?? {
        id: Number(uid),
        first_name: 'User',
        last_name: String(uid),
        email: '',
      },
    );
    knownIds.add(Number(uid));
  }

  return list.sort((a, b) => Number(a.id) - Number(b.id));
}

export async function getAttendancePageData(currentUser, { preset = 'week' } = {}) {
  const range = getWeekRange(preset);
  const { start, end } = range;

  const monthRange = getWeekRange('month');
  const [records, monthRecords, allUsers] = await Promise.all([
    fetchAllAttendance({ start_date: start, end_date: end }),
    fetchAllAttendance({ start_date: monthRange.start, end_date: monthRange.end }),
    getUsersList().catch(() => []),
  ]);

  const userMap = buildAttendanceUserMap(currentUser, allUsers);
  const baseUsers = Object.values(userMap).sort((a, b) => Number(a.id) - Number(b.id));
  const users = mergeUsersFromRecords(baseUsers, records, userMap);

  const groups = buildAttendanceGroups(records, users, range);
  const activeSession = currentUser?.id
    ? findActiveSession(records, currentUser.id)
    : null;
  const heatmapWeeks = currentUser?.id
    ? buildHeatmapWeeks(monthRecords, currentUser.id)
    : [];

  return {
    records,
    userMap,
    users,
    groups,
    activeSession,
    heatmapWeeks,
    range,
  };
}
