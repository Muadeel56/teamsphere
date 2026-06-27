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
  const raw = typeof record.user === 'object' ? record.user.id : record.user;
  return raw == null ? null : Number(raw);
}

function sameUserId(a, b) {
  if (a == null || b == null) return false;
  return Number(a) === Number(b);
}

function findRecordForDay(records, userId, dateStr) {
  return records.find(
    (r) => sameUserId(getRecordUserId(r), userId) && r.date === dateStr,
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

export function formatDateGroupLabel(dateStr) {
  const d = parseLocalDate(dateStr);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

export function formatDurationMinutes(totalMinutes) {
  if (totalMinutes <= 0) return '0m';
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h > 0) return `${h}h ${m > 0 ? `${m}m` : ''}`.trim();
  return `${m}m`;
}

export function formatRecordDuration(record, status) {
  if (status === 'absent' || !record?.check_in) return '—';

  const start = new Date(record.check_in);
  const end = record.check_out ? new Date(record.check_out) : new Date();
  const mins = Math.max(0, Math.floor((end - start) / 60000));
  const formatted = formatDurationMinutes(mins);

  if (!record.check_out) return `${formatted} · open`;
  return formatted;
}

export const STATUS_META = {
  present: { label: 'Present', fg: 'var(--color-success)', bg: 'var(--color-success-subtle)' },
  late: { label: 'Late', fg: 'var(--color-warning)', bg: 'var(--color-warning-subtle)' },
  incomplete: { label: 'Missing out', fg: 'var(--color-warning)', bg: 'var(--color-warning-subtle)' },
  absent: { label: 'Absent', fg: 'var(--color-muted)', bg: 'var(--color-surface-2)' },
};

function isWeekday(date) {
  const day = date.getDay();
  return day >= 1 && day <= 5;
}

function listDatesInRange(dateRange) {
  const start = parseLocalDate(dateRange.start);
  const end = parseLocalDate(dateRange.end);
  const dates = [];

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    if (dateRange.preset === 'week' && !isWeekday(d)) continue;
    dates.push(toDateString(d));
  }

  return dates;
}

function decorateAttendanceRow(record, user) {
  const status = deriveDayStatus(record);
  const meta = STATUS_META[status] ?? STATUS_META.absent;

  return {
    userId: user.id,
    name: getUserDisplayName(user),
    initials: getUserInitials(user),
    checkIn: record?.check_in ? formatCheckInTime(record.check_in) : '—',
    checkOut: !record?.check_in
      ? '—'
      : !record.check_out
        ? 'Not yet'
        : formatCheckInTime(record.check_out),
    outColor: status === 'incomplete' ? 'var(--color-warning)' : 'var(--color-text)',
    duration: formatRecordDuration(record, status),
    status,
    statusLabel: meta.label,
    statusFg: meta.fg,
    statusBg: meta.bg,
    rowBg:
      status === 'incomplete'
        ? 'color-mix(in oklch, var(--color-warning-subtle) 40%, transparent)'
        : 'transparent',
    record,
  };
}

export function buildAttendanceGroups(records, users, dateRange) {
  const dates = listDatesInRange(dateRange).sort().reverse();

  return dates.map((dateStr) => {
    const rows = users.map((user) => {
      const record = findRecordForDay(records, user.id, dateStr);
      return decorateAttendanceRow(record, user);
    });

    const present = rows.filter((r) => r.status !== 'absent').length;
    const missing = rows.filter((r) => r.status === 'incomplete').length;

    return {
      label: formatDateGroupLabel(dateStr),
      date: dateStr,
      summary: `${present} in · ${missing} missing out`,
      rows,
    };
  });
}

export function computeAttendanceStats(records, users, dateRange, { isClockedIn, elapsed } = {}) {
  const todayStr = toDateString(new Date());
  const todayRows = users.map((user) => {
    const record = findRecordForDay(records, user.id, todayStr);
    return deriveDayStatus(record);
  });

  const presentToday = todayRows.filter((s) => s !== 'absent').length;
  const completed = records.filter((r) => r.check_in && r.check_out);
  const avgMin = completed.length
    ? Math.round(
        completed.reduce((sum, r) => {
          const mins = Math.floor(
            (new Date(r.check_out) - new Date(r.check_in)) / 60000,
          );
          return sum + mins;
        }, 0) / completed.length,
      )
    : 0;

  const scopeRecords = dateRange.preset === 'today'
    ? records.filter((r) => r.date === todayStr)
    : records;
  const missingOut = scopeRecords.filter((r) => deriveDayStatus(r) === 'incomplete').length;

  return {
    presentToday: `${presentToday}/${users.length || 0}`,
    avgHours: formatDurationMinutes(avgMin),
    missingOut: String(missingOut),
    sessionValue: isClockedIn ? elapsed : 'Out',
    sessionLabel: isClockedIn ? 'Your session' : 'Your status',
  };
}

export function buildHeatmapWeeks(records, userId, weeks = 12) {
  const heatLevels = [
    'var(--color-surface-2)',
    'var(--heat-1)',
    'var(--heat-2)',
    'var(--heat-3)',
    'var(--heat-4)',
  ];

  const userRecords = records.filter((r) => sameUserId(getRecordUserId(r), userId));
  const hoursByDate = Object.fromEntries(
    userRecords.map((r) => {
      const status = deriveDayStatus(r);
      if (status === 'absent' || !r.check_in) return [r.date, 0];
      const end = r.check_out ? new Date(r.check_out) : new Date();
      const hrs = Math.max(0, (end - new Date(r.check_in)) / 3600000);
      return [r.date, hrs];
    }),
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(today.getDate() - (weeks * 7 - 1));

  const result = [];
  let cursor = new Date(start);

  while (cursor <= today) {
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const dateStr = toDateString(cursor);
      const hrs = hoursByDate[dateStr] ?? 0;
      let level = 0;
      if (hrs > 0) {
        if (hrs < 4) level = 1;
        else if (hrs < 6) level = 2;
        else if (hrs < 8) level = 3;
        else level = 4;
      }
      weekDays.push({
        bg: heatLevels[level],
        title: hrs > 0 ? `${Math.round(hrs)}h logged` : 'No hours',
      });
      cursor.setDate(cursor.getDate() + 1);
      if (cursor > today) break;
    }
    if (weekDays.length) result.push({ days: weekDays });
  }

  return result.slice(-weeks);
}

export function exportAttendanceGroupsCsv(groups) {
  const lines = [];
  for (const group of groups) {
    lines.push(`"${group.label}"`);
    lines.push(['Member', 'In', 'Out', 'Duration', 'Status'].join(','));
    for (const row of group.rows) {
      lines.push(
        [row.name, row.checkIn, row.checkOut, row.duration, row.statusLabel]
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(','),
      );
    }
    lines.push('');
  }

  const csv = lines.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `attendance-${toDateString(new Date())}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function buildWeeklyGrid(records, users, weekStart, dateRange = {}) {
  const weekDays = getWeekDaysForRange(dateRange.preset, weekStart, dateRange);
  const dayLabels = getGridDayLabels(weekDays);

  return users.map((user) => {
    const dayCells = weekDays.map((dateStr, index) => {
      const record = findRecordForDay(records, user.id, dateStr);
      const status = deriveDayStatus(record);
      return { status, record, date: dateStr, label: dayLabels[index] };
    });

    const attended = dayCells.filter(
      (d) => d.status === 'present' || d.status === 'late' || d.status === 'incomplete',
    ).length;
    const dayCount = weekDays.length;
    const totalPercent = dayCount > 0 ? Math.round((attended / dayCount) * 100) : 0;

    return {
      userId: user.id,
      name: getUserDisplayName(user),
      initials: getUserInitials(user),
      days: dayCells,
      dayLabels,
      attended,
      totalPercent,
      totalLabel: `${attended}/${dayCount} · ${totalPercent}%`,
    };
  });
}

export function getGridDayLabels(weekDays) {
  return weekDays.map((dateStr) => {
    const d = parseLocalDate(dateStr);
    return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(d);
  });
}

function getWeekDaysForRange(preset, weekStart, dateRange) {
  if (preset === 'today' && dateRange?.start) {
    return [dateRange.start];
  }

  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return toDateString(d);
  });
}

function shouldCountDay(date, preset) {
  if (preset === 'today') return true;
  return isWeekday(date);
}

export function computeSummary(records, users, dateRange) {
  let present = 0;
  let absent = 0;
  let late = 0;

  const start = parseLocalDate(dateRange.start);
  const end = parseLocalDate(dateRange.end);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    if (!shouldCountDay(d, dateRange.preset)) continue;
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
      return sameUserId(uid, userId) && r.date === today && !r.check_out;
    }) ?? null
  );
}

export function exportAttendanceCsv(grid) {
  const dayLabels = grid[0]?.dayLabels ?? grid[0]?.days?.map((d) => d.label) ?? DAY_LABELS;
  const header = ['Member', ...dayLabels, 'Total'].join(',');
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
