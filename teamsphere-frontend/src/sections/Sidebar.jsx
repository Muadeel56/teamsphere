import { Link, useLocation } from 'react-router-dom';
import { Home, Briefcase, CheckSquare, Users, Clock } from 'lucide-react';
import { useUIStore } from '../store/uiStore';
import { cn } from '../lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Projects', href: '/projects', icon: Briefcase },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Teams', href: '/teams', icon: Users },
  { name: 'Attendance', href: '/attendance', icon: Clock },
];

export default function Sidebar() {
  const location = useLocation();
  const sidebarMobileOpen = useUIStore((s) => s.sidebarMobileOpen);

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-ts-border bg-ts-surface transition-transform duration-200 dark:border-gray-700 dark:bg-gray-900',
        sidebarMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}
    >
      <div className="border-b border-ts-border px-6 py-5 dark:border-gray-700">
        <h1 className="text-xl font-bold text-ts-text dark:text-white">TeamSphere</h1>
        <p className="mt-1 text-sm text-ts-text-muted dark:text-gray-400">Manage your team</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-ts-primary dark:bg-blue-950/50 dark:text-blue-400'
                  : 'text-ts-text-muted hover:bg-gray-100 hover:text-ts-text dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
              )}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-ts-border px-6 py-4 dark:border-gray-700">
        <p className="text-xs text-ts-text-muted dark:text-gray-500">
          &copy; {new Date().getFullYear()} TeamSphere
        </p>
      </div>
    </aside>
  );
}
