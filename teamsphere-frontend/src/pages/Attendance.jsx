import { useCallback, useEffect, useMemo, useState } from 'react';
import { Download, Users, Clock, AlertTriangle, Timer } from 'lucide-react';
import { toast } from 'sonner';

import { useAuthStore } from '../store/authStore';
import {
  checkIn,
  checkOut,
  getAttendancePageData,
} from '../services/attendance';
import { computeAttendanceStats, exportAttendanceGroupsCsv, formatElapsed } from '../lib/attendanceHelpers';

import Button from '../components/Button';
import AttendanceStatChip from '../components/attendance/AttendanceStatChip';
import AttendanceRecordGroups from '../components/attendance/AttendanceRecordGroups';
import AttendanceHeatmap from '../components/attendance/AttendanceHeatmap';
import HeaderClockButton from '../components/attendance/HeaderClockButton';
import AttendanceSkeleton, { AttendanceKpiSkeleton } from '../components/attendance/AttendanceSkeleton';
import AttendanceEmptyState from '../components/attendance/AttendanceEmptyState';
import AttendanceErrorState from '../components/attendance/AttendanceErrorState';

const PRESETS = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This week' },
  { id: 'month', label: 'This month' },
];

function DateRangePicker({ value, onChange }) {
  return (
    <div
      className="flex gap-0.5 p-[3px] rounded-[9px] border border-[var(--color-border)] bg-[var(--color-surface)]"
      role="group"
      aria-label="Date range"
    >
      {PRESETS.map((preset) => {
        const active = value === preset.id;
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onChange(preset.id)}
            aria-pressed={active}
            className="h-[34px] px-[13px] rounded-[7px] border-none cursor-pointer text-[13px] font-semibold transition-[background,color] duration-150 focus:outline-none focus-visible:shadow-[0_0_0_3px_var(--color-ring)]"
            style={{
              background: active ? 'var(--color-primary-subtle)' : 'transparent',
              color: active ? 'var(--color-primary)' : 'var(--color-muted)',
            }}
          >
            {preset.label}
          </button>
        );
      })}
    </div>
  );
}

export default function Attendance() {
  const user = useAuthStore((s) => s.user);

  const [datePreset, setDatePreset] = useState('today');
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [records, setRecords] = useState([]);
  const [dateRange, setDateRange] = useState({ preset: 'today', start: '', end: '' });
  const [heatmapWeeks, setHeatmapWeeks] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [clockLoading, setClockLoading] = useState(false);
  const [elapsed, setElapsed] = useState('0:00:00');

  const isClockedIn = Boolean(activeSession);

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const data = await getAttendancePageData(user, { preset: datePreset });
      setGroups(data.groups);
      setUsers(data.users);
      setRecords(data.records);
      setDateRange(data.range);
      setHeatmapWeeks(data.heatmapWeeks);
      setActiveSession(data.activeSession);
      return data;
    } catch {
      setLoadError(true);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, datePreset]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!activeSession?.check_in) {
      setElapsed('0:00:00');
      return undefined;
    }

    const tick = () => setElapsed(formatElapsed(activeSession.check_in));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [activeSession]);

  const isEmpty = useMemo(() => {
    if (loading || loadError) return false;
    if (records.length > 0) return false;
    return groups.every((g) => g.rows.every((r) => r.status === 'absent'));
  }, [loading, loadError, records, groups]);

  const stats = useMemo(
    () =>
      computeAttendanceStats(records, users, dateRange, {
        isClockedIn,
        elapsed,
      }),
    [records, users, dateRange, isClockedIn, elapsed],
  );

  const statChips = useMemo(
    () => [
      {
        value: stats.presentToday,
        label: 'Present today',
        tintBg: 'var(--color-success-subtle)',
        tintFg: 'var(--color-success)',
        icon: <Users size={18} />,
      },
      {
        value: stats.avgHours,
        label: 'Avg hours / day',
        tintBg: 'var(--color-info-subtle)',
        tintFg: 'var(--color-info)',
        icon: <Clock size={18} />,
      },
      {
        value: stats.missingOut,
        label: 'Missing check-outs',
        tintBg: 'var(--color-warning-subtle)',
        tintFg: 'var(--color-warning)',
        icon: <AlertTriangle size={18} />,
      },
      {
        value: stats.sessionValue,
        label: stats.sessionLabel,
        tintBg: 'var(--color-primary-subtle)',
        tintFg: 'var(--color-primary)',
        icon: <Timer size={18} />,
      },
    ],
    [stats],
  );

  const handleCheckIn = async () => {
    setClockLoading(true);
    try {
      await checkIn();
      toast.success('Checked in — clock running');
      await loadData();
    } catch {
      toast.error('Failed to clock in. Please try again.');
    } finally {
      setClockLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setClockLoading(true);
    try {
      await checkOut();
      toast.success('Checked out — time logged');
      await loadData();
    } catch {
      toast.error('Failed to clock out. Please try again.');
    } finally {
      setClockLoading(false);
    }
  };

  const handleExport = () => {
    if (groups.length === 0) return;
    exportAttendanceGroupsCsv(groups);
    toast.success('Attendance exported');
  };

  return (
    <div>
      <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
        <div>
          <h2 className="font-serif text-[30px] leading-[1.15] font-medium tracking-[-0.01em] text-[var(--color-text)] m-0">
            Attendance
          </h2>
          <p className="mt-[7px] text-[15px] text-[var(--color-muted)] m-0">
            Who&apos;s in, hours logged, and the gaps to chase.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <DateRangePicker value={datePreset} onChange={setDatePreset} />
          <HeaderClockButton
            isClockedIn={isClockedIn}
            elapsed={elapsed}
            loading={clockLoading}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
          />
          <Button
            variant="secondary"
            icon={<Download size={16} />}
            onClick={handleExport}
            disabled={loading || isEmpty}
          >
            Export
          </Button>
        </div>
      </div>

      {loading ? (
        <AttendanceKpiSkeleton />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(166px,1fr))] gap-3.5 mb-[22px]">
          {statChips.map((chip) => (
            <AttendanceStatChip key={chip.label} {...chip} />
          ))}
        </div>
      )}

      <div className="attendance-page-grid">
        <div className="min-w-0">
          {loading ? (
            <AttendanceSkeleton />
          ) : loadError ? (
            <AttendanceErrorState onRetry={loadData} />
          ) : isEmpty ? (
            <AttendanceEmptyState
              onWidenRange={datePreset !== 'month' ? () => setDatePreset('month') : undefined}
            />
          ) : (
            <AttendanceRecordGroups groups={groups} />
          )}
        </div>

        {!loading && !loadError && !isEmpty && heatmapWeeks.length > 0 && (
          <aside className="min-w-0">
            <AttendanceHeatmap weeks={heatmapWeeks} />
          </aside>
        )}
      </div>
    </div>
  );
}
