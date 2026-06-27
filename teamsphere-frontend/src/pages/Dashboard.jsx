import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FolderOpen } from 'lucide-react';

import { useAuthStore } from '../store/authStore';
import { getUserDisplayName } from '../lib/userInitials';
import { getDashboardData } from '../services/dashboard';
import { VELOCITY_BARS, RECENT_ACTIVITY } from '../data/dashboardSeed';

import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import { SkeletonBlock, SkeletonCard } from '../components/SkeletonCard';
import DashboardKpiCard from '../components/dashboard/DashboardKpiCard';
import VelocityChart from '../components/dashboard/VelocityChart';
import RecentActivityFeed from '../components/dashboard/RecentActivityFeed';

function getGreeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

function KpiSkeletonCard() {
  return (
    <SkeletonCard className="p-[18px]">
      <div className="flex items-center justify-between">
        <SkeletonBlock className="h-[13px] w-20" />
        <SkeletonBlock className="h-[30px] w-[30px] rounded-lg" />
      </div>
      <SkeletonBlock className="my-3.5 mb-2 h-8 w-16" />
      <SkeletonBlock className="h-3 w-[100px]" />
    </SkeletonCard>
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
      {[0, 1, 2, 3].map((i) => (
        <KpiSkeletonCard key={i} />
      ))}
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
    },
  ];

  const isEmpty = kpis && kpis.projects === 0 && kpis.tasks === 0;

  return (
    <div>
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

      {loading ? (
        <KpiSkeletonGrid />
      ) : isEmpty ? (
        <EmptyState
          eyebrow="Dashboard"
          title="Nothing here yet"
          description="Create your first project to start tracking work across your teams."
          actionLabel="Create project"
          actionIcon={<Plus size={16} />}
          onAction={() => navigate('/projects')}
          icon={
            <div
              className="mb-6 grid h-[84px] w-[84px] place-items-center rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-muted)]"
              style={{ animation: 'ds-floaty 3s ease-in-out infinite alternate' }}
            >
              <FolderOpen size={36} strokeWidth={1.4} />
            </div>
          }
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(216px, 1fr))',
            gap: '16px',
            marginTop: '24px',
          }}
        >
          {kpiDefs.map((k, index) => (
            <DashboardKpiCard key={k.label} {...k} animationDelay={`${index * 0.06}s`} />
          ))}
        </div>
      )}

      {!loading && !isEmpty && (
        <div className="dashboard-two-col">
          <VelocityChart bars={VELOCITY_BARS} />
          <RecentActivityFeed items={RECENT_ACTIVITY} />
        </div>
      )}

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
