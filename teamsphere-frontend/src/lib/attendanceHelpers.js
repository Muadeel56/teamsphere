import { getUserDisplayName, getUserInitials } from './userInitials';

export const LATE_AFTER_HOUR = 9;
export const LATE_AFTER_MINUTE = 0;

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

function pad2(n) {
  return String(n).padStart(2, '0');
}

export function toDateString(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function parseLocalDate(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function getWeekRange(preset) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (preset === 'today') {
    const s = toDateString(today);
    return { start: s, end: s, preset };
  }

  if (preset === 'month') {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return { start: toDateString(start), end: toDateString(end), preset };
  }

  const day = today.getDay();
  const diffToMon = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMon);
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);
  return { start: toDateString(monday), end: toDateString(friday), preset: 'week' };
}

export function getTableWeekStart(rangeEnd) {
  const end = parseLocalDate(rangeEnd);
  const day = end.getDay();
  const diffToMon = day === 0 ? -6 : 1 - day;
  const monday = new Date(end);
  monday.setDate(end.getDate() + diffToMon);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function getRecordUserId(record) {
  if (!record) return null;
  return typeof record.user === 'object' ? record.user.id : record.user;
}

function findRecordForDay(records, userId, dateStr) {
  return records.find(
    (r) => getRecordUserId(r) === userId && r.date === dateStr,
  );
}

function isLate(checkInIso) {
  if (!checkInIso) return false;
  const checkIn = new Date(checkInIso);
  const threshold = new Date(checkIn);
  threshold.setHours(LATE_AFTER_HOUR, LATE_AFTER_MINUTE, 0, 0);
  return checkIn > threshold;
}

export function deriveDayStatus(record) {
  if (!record || !record.check_in) return 'absent';

  const late = isLate(record.check_in);
  const open = !record.check_out;

  if (open) {
    if (late) return 'late';
    return 'incomplete';
  }

  if (late) return 'late';
  return 'present';
}

export function formatCheckInTime(checkInIso) {
  if (!checkInIso) return '';
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(checkInIso));
}

export function statusTooltip(status, record) {
  const time = record?.check_in ? formatCheckInTime(record.check_in) : '';
  const labels = {
    present: 'Present',
    late: 'Late',
    absent: 'Absent',
    incomplete: 'In progress',
  };
  const label = labels[status] ?? status;
  return time ? `${label} · ${time}` : label;
}

export function buildWeeklyGrid(records, users, weekStart) {
  const weekDays = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return toDateString(d);
  });

  return users.map((user) => {
    const dayCells = weekDays.map((dateStr) => {
      const record = findRecordForDay(records, user.id, dateStr);
      const status = deriveDayStatus(record);
      return { status, record, date: dateStr };
    });

    const attended = dayCells.filter(
      (d) => d.status === 'present' || d.status === 'late' || d.status === 'incomplete',
    ).length;
    const totalPercent = Math.round((attended / 5) * 100);

    return {
      userId: user.id,
      name: getUserDisplayName(user),
      initials: getUserInitials(user),
      days: dayCells,
      attended,
      totalPercent,
      totalLabel: `${attended}/5 · ${totalPercent}%`,
    };
  });
}

function isWeekday(date) {
  const day = date.getDay();
  return day >= 1 && day <= 5;
}

export function computeSummary(records, users, dateRange) {
  let present = 0;
  let absent = 0;
  let late = 0;

  const start = parseLocalDate(dateRange.start);
  const end = parseLocalDate(dateRange.end);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    if (!isWeekday(d)) continue;
    const dateStr = toDateString(d);

    for (const user of users) {
      const record = findRecordForDay(records, user.id, dateStr);
      const status = deriveDayStatus(record);
      if (status === 'present') present += 1;
      else if (status === 'late' || status === 'incomplete') late += 1;
      else absent += 1;
    }
  }

  const total = present + absent + late;
  const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

  return { present, absent, late, rate };
}

export function formatElapsed(checkInIso) {
  if (!checkInIso) return '0:00:00';
  const start = new Date(checkInIso);
  const now = new Date();
  const diff = Math.max(0, Math.floor((now - start) / 1000));
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;
  return `${h}:${pad2(m)}:${pad2(s)}`;
}

export function findActiveSession(records, userId) {
  const today = toDateString(new Date());
  return (
    records.find((r) => {
      const uid = getRecordUserId(r);
      return uid === userId && r.date === today && !r.check_out;
    }) ?? null
  );
}

export function exportAttendanceCsv(grid) {
  const header = ['Member', ...DAY_LABELS, 'Total'].join(',');
  const rows = grid.map((row) => {
    const dayStatuses = row.days.map((d) => d.status);
    return [row.name, ...dayStatuses, row.totalLabel]
      .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
      .join(',');
  });
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `attendance-${toDateString(new Date())}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export { DAY_LABELS };
