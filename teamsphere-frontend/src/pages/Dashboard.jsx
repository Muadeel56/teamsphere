import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FolderOpen } from 'lucide-react';

import { useAuthStore } from '../store/authStore';
import { getUserDisplayName } from '../lib/userInitials';
import { getDashboardData } from '../services/dashboard';
import { VELOCITY_BARS, RECENT_ACTIVITY } from '../data/dashboardSeed';

import Button from '../components/Button';
import DashboardKpiCard from '../components/dashboard/DashboardKpiCard';
import VelocityChart from '../components/dashboard/VelocityChart';
import RecentActivityFeed from '../components/dashboard/RecentActivityFeed';

function getGreeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

const shimmerStyle = {
  background: 'var(--skel)',
  backgroundSize: '300% 100%',
  animation: 'ds-shimmer 1.3s infinite linear',
  borderRadius: '8px',
};

function KpiSkeletonCard() {
  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '14px',
        padding: '18px',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ ...shimmerStyle, width: '80px', height: '13px' }} />
        <div style={{ ...shimmerStyle, width: '30px', height: '30px', borderRadius: '8px' }} />
      </div>
      <div style={{ ...shimmerStyle, width: '64px', height: '32px', margin: '14px 0 8px' }} />
      <div style={{ ...shimmerStyle, width: '100px', height: '12px' }} />
    </div>
  );
}

function KpiSkeletonGrid() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(216px, 1fr))',
        gap: '16px',
        marginTop: '24px',
      }}
    >
      {[0, 1, 2, 3].map((i) => <KpiSkeletonCard key={i} />)}
    </div>
  );
}

function EmptyState({ onAction }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '72px 24px',
        animation: 'ds-rise .4s cubic-bezier(.2,.8,.2,1) both',
      }}
    >
      <div
        style={{
          width: '84px',
          height: '84px',
          borderRadius: '22px',
          background: 'var(--color-surface-2)',
          border: '1px solid var(--color-border)',
          display: 'grid',
          placeItems: 'center',
          marginBottom: '24px',
          animation: 'ds-floaty 3s ease-in-out infinite alternate',
          color: 'var(--color-muted)',
        }}
      >
        <FolderOpen size={36} strokeWidth={1.4} />
      </div>
      <h3
        style={{
          font: "500 24px 'Newsreader'",
          letterSpacing: '-0.01em',
          margin: '0 0 10px',
          color: 'var(--color-text)',
        }}
      >
        Nothing here yet
      </h3>
      <p
        style={{
          font: "400 15px/1.6 'Hanken Grotesk'",
          color: 'var(--color-muted)',
          margin: '0 0 26px',
          maxWidth: '42ch',
        }}
      >
        Create your first project to start tracking work across your teams.
      </p>
      <Button onClick={onAction} icon={<Plus size={16} />}>
        Create project
      </Button>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const firstName = user?.first_name || getUserDisplayName(user).split(' ')[0];

  const greeting = getGreeting();
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDashboardData()
      .then((data) => setKpis(data.kpis))
      .catch((err) => setError(err?.message || 'Failed to load dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  const kpiDefs = [
    {
      label: 'Active projects',
      value: kpis?.projects ?? '—',
      glyph: 'P',
      tintBg: 'var(--color-primary-subtle)',
      tintFg: 'var(--color-primary)',
      delta: kpis ? '+2' : '—',
      deltaNote: 'this month',
      deltaColor: 'var(--color-success)',
      animationDelay: '0.02s',
    },
    {
      label: 'Tasks due today',
      value: kpis?.tasks ?? '—',
      glyph: 'T',
      tintBg: 'var(--color-warning-subtle)',
      tintFg: 'var(--color-warning)',
      delta: kpis ? '3' : '—',
      deltaNote: 'high priority',
      deltaColor: 'var(--color-warning)',
      animationDelay: '0.09s',
    },
    {
      label: 'Team online',
      value: kpis ? String(kpis.teamOnline) : '—',
      glyph: 'U',
      tintBg: 'var(--color-info-subtle)',
      tintFg: 'var(--color-info)',
      delta: 'of 31',
      deltaNote: 'members',
      deltaColor: 'var(--color-muted)',
      animationDelay: '0.16s',
    },
    {
      label: 'Attendance',
      value: kpis ? `${kpis.attendance}%` : '—',
      glyph: 'A',
      tintBg: 'var(--color-success-subtle)',
      tintFg: 'var(--color-success)',
      delta: '+1.2%',
      deltaNote: 'vs last week',
      deltaColor: 'var(--color-success)',
      animationDelay: '0.23s',
    },
  ];

  const isEmpty = kpis && kpis.projects === 0 && kpis.tasks === 0;

  return (
    <div>
      {/* Page header */}
      <div style={{ animation: 'ds-rise .4s cubic-bezier(.2,.8,.2,1) both' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
            marginBottom: '6px',
          }}
        >
          <div>
            <h2
              style={{
                font: "500 30px/1.15 'Newsreader'",
                letterSpacing: '-0.01em',
                margin: 0,
                color: 'var(--color-text)',
              }}
            >
              {greeting}, {firstName}
            </h2>
            <p
              style={{
                font: "400 15px 'Hanken Grotesk'",
                color: 'var(--color-muted)',
                margin: '7px 0 0',
              }}
            >
              Here&apos;s where your teams stand today — {formattedDate}
            </p>
          </div>
          <Button onClick={() => navigate('/projects')} icon={<Plus size={16} />}>
            New project
          </Button>
        </div>
      </div>

      {/* Inline error banner */}
      {error && (
        <div
          style={{
            background: 'var(--color-danger-subtle)',
            border: '1px solid var(--color-danger)',
            borderRadius: '10px',
            padding: '12px 16px',
            marginTop: '16px',
            font: "400 13px 'Hanken Grotesk'",
            color: 'var(--color-danger)',
          }}
        >
          {error}
        </div>
      )}

      {/* KPI grid */}
      {loading ? (
        <KpiSkeletonGrid />
      ) : isEmpty ? (
        <EmptyState onAction={() => navigate('/projects')} />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(216px, 1fr))',
            gap: '16px',
            marginTop: '24px',
          }}
        >
          {kpiDefs.map((k) => (
            <DashboardKpiCard key={k.label} {...k} />
          ))}
        </div>
      )}

      {/* Two-column: velocity + activity */}
      {!loading && !isEmpty && (
        <div className="dashboard-two-col">
          <VelocityChart bars={VELOCITY_BARS} />
          <RecentActivityFeed items={RECENT_ACTIVITY} />
        </div>
      )}

      {/* Content slot */}
      {!loading && !isEmpty && (
        <div
          style={{
            marginTop: '16px',
            border: '1.5px dashed var(--color-border-strong)',
            borderRadius: '14px',
            padding: '26px',
            textAlign: 'center',
            background: 'var(--color-surface-2)',
          }}
        >
          <div
            style={{
              font: "500 12px 'IBM Plex Mono'",
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-subtle)',
            }}
          >
            Content slot
          </div>
          <div
            style={{
              font: "400 14px 'Hanken Grotesk'",
              color: 'var(--color-muted)',
              marginTop: '8px',
              maxWidth: '46ch',
              marginInline: 'auto',
            }}
          >
            Page content renders here. Swap this for Projects, Tasks, Teams, or Attendance — the shell stays put.
          </div>
        </div>
      )}
    </div>
  );
}
