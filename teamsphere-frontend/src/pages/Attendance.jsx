import { useCallback, useEffect, useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

import { useAuthStore } from '../store/authStore';
import {
  checkIn,
  checkOut,
  getAttendancePageData,
} from '../services/attendance';
import { exportAttendanceCsv, formatElapsed } from '../lib/attendanceHelpers';

import Button from '../components/Button';
import DashboardKpiCard from '../components/dashboard/DashboardKpiCard';
import AttendanceWeeklyTable from '../components/attendance/AttendanceWeeklyTable';
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
      style={{
        display: 'flex',
        gap: '2px',
        padding: '3px',
        borderRadius: '9px',
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
      }}
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
            style={{
              height: '34px',
              padding: '0 13px',
              borderRadius: '7px',
              border: 'none',
              cursor: 'pointer',
              font: "600 13px 'Hanken Grotesk'",
              background: active ? 'var(--color-primary-subtle)' : 'transparent',
              color: active ? 'var(--color-primary)' : 'var(--color-muted)',
              transition: 'background .15s, color .15s',
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
  const [weeklyGrid, setWeeklyGrid] = useState([]);
  const [summary, setSummary] = useState({ present: 0, absent: 0, late: 0, rate: 0 });
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
      setWeeklyGrid(data.weeklyGrid);
      setSummary(data.summary);
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
    const hasRecords = weeklyGrid.some((row) =>
      row.days.some((d) => d.status !== 'absent'),
    );
    return weeklyGrid.length === 0 || !hasRecords;
  }, [loading, loadError, weeklyGrid]);

  const kpiDefs = useMemo(
    () => [
      {
        label: 'Present',
        value: summary.present,
        glyph: '✓',
        tintBg: 'var(--color-success-subtle)',
        tintFg: 'var(--color-success)',
        delta: '',
        deltaNote: 'on time',
        deltaColor: 'var(--color-success)',
        animationDelay: '0.02s',
      },
      {
        label: 'Absent',
        value: summary.absent,
        glyph: '—',
        tintBg: 'var(--color-danger-subtle)',
        tintFg: 'var(--color-danger)',
        delta: '',
        deltaNote: 'no record',
        deltaColor: 'var(--color-muted)',
        animationDelay: '0.06s',
      },
      {
        label: 'Late',
        value: summary.late,
        glyph: '!',
        tintBg: 'var(--color-warning-subtle)',
        tintFg: 'var(--color-warning)',
        delta: '',
        deltaNote: 'after 9 AM',
        deltaColor: 'var(--color-warning)',
        animationDelay: '0.1s',
      },
      {
        label: isClockedIn ? 'Your session' : 'Rate',
        value: isClockedIn ? elapsed : `${summary.rate}%`,
        glyph: isClockedIn ? '⏱' : '%',
        tintBg: 'var(--color-primary-subtle)',
        tintFg: 'var(--color-primary)',
        delta: '',
        deltaNote: isClockedIn ? 'clock running' : 'attendance',
        deltaColor: 'var(--color-primary)',
        animationDelay: '0.14s',
      },
    ],
    [summary, isClockedIn, elapsed],
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
    if (weeklyGrid.length === 0) return;
    exportAttendanceCsv(weeklyGrid);
    toast.success('Attendance exported');
  };

  return (
    <div style={{ animation: 'ds-rise .4s cubic-bezier(.2,.8,.2,1) both' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
          marginBottom: '24px',
        }}
      >
        <div>
          <h2 className="font-serif text-[30px] leading-[1.15] font-medium tracking-[-0.01em] text-[var(--color-text)] m-0">
            Attendance
          </h2>
          <p className="mt-[7px] text-[15px] text-[var(--color-muted)] m-0">
            Who&apos;s in, hours logged, and the gaps to chase.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
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

      {/* KPI row */}
      {loading ? (
        <AttendanceKpiSkeleton />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(166px, 1fr))',
            gap: '14px',
            marginBottom: '22px',
          }}
        >
          {kpiDefs.map((k) => (
            <DashboardKpiCard key={k.label} {...k} />
          ))}
        </div>
      )}

      {/* Main content */}
      {loading ? (
        <AttendanceSkeleton />
      ) : loadError ? (
        <AttendanceErrorState onRetry={loadData} />
      ) : isEmpty ? (
        <AttendanceEmptyState
          onWidenRange={datePreset !== 'month' ? () => setDatePreset('month') : undefined}
        />
      ) : (
        <div className="attendance-main-grid">
          <AttendanceWeeklyTable grid={weeklyGrid} />
        </div>
      )}
    </div>
  );
}
