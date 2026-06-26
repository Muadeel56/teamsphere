import { useEffect, useState } from 'react';
import { getProjects } from '../services/projects';
import { getTasks } from '../services/tasks';
import { getTeams } from '../services/teams';
import { getAttendance } from '../services/attendance';
import Card from '../components/Card';
import { Briefcase, CheckSquare, Users, CalendarDays } from 'lucide-react';

const statList = [
  {
    label: 'Projects',
    key: 'projects',
    icon: Briefcase,
    accent: 'bg-blue-500',
    iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
  },
  {
    label: 'Tasks',
    key: 'tasks',
    icon: CheckSquare,
    accent: 'bg-emerald-500',
    iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400',
  },
  {
    label: 'Teams',
    key: 'teams',
    icon: Users,
    accent: 'bg-violet-500',
    iconBg: 'bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400',
  },
  {
    label: 'Attendance',
    key: 'attendance',
    icon: CalendarDays,
    accent: 'bg-amber-500',
    iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400',
  },
];

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, tasks: 0, teams: 0, attendance: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError(null);
      try {
        const [projects, tasks, teams, attendance] = await Promise.all([
          getProjects(),
          getTasks(),
          getTeams(),
          getAttendance(),
        ]);
        setStats({
          projects: projects.data.length,
          tasks: tasks.data.length,
          teams: teams.data.length,
          attendance: attendance.data.length,
        });
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-ts-primary border-t-transparent" />
          <p className="text-sm text-ts-text-muted dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Card className="max-w-md text-center">
          <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <header className="ts-page-header">
        <h1 className="ts-page-title">Dashboard Overview</h1>
        <p className="ts-page-subtitle">
          Welcome back! Here&apos;s what&apos;s happening with your team.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statList.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.key} className="overflow-hidden p-0">
              <div className={`h-1 ${stat.accent}`} />
              <div className="flex items-start justify-between p-5">
                <div>
                  <p className="text-sm font-medium text-ts-text-muted dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-4xl font-bold tracking-tight text-ts-text dark:text-white">
                    {stats[stat.key]}
                  </p>
                </div>
                <div className={`rounded-xl p-3 ${stat.iconBg}`}>
                  <Icon size={22} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-ts-text dark:text-white">Quick summary</h2>
          <p className="mt-2 text-sm leading-relaxed text-ts-text-muted dark:text-gray-400">
            You have <strong className="text-ts-text dark:text-white">{stats.projects}</strong> active
            projects, <strong className="text-ts-text dark:text-white">{stats.tasks}</strong> tasks,
            and <strong className="text-ts-text dark:text-white">{stats.teams}</strong> teams on the
            platform.
          </p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-ts-text dark:text-white">Getting started</h2>
          <ul className="mt-3 space-y-2 text-sm text-ts-text-muted dark:text-gray-400">
            <li>Use the sidebar to manage projects, tasks, and teams.</li>
            <li>Track attendance from the Attendance section.</li>
            <li>Invite teammates to collaborate on shared work.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
