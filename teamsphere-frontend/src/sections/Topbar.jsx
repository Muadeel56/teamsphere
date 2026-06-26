import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { Bell, Sun, Moon, Menu, X } from 'lucide-react';
import Button from '../components/Button';

export default function Topbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { theme, setTheme, sidebarOpen, toggleSidebar } = useUIStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-ts-border bg-ts-surface/95 px-4 backdrop-blur sm:px-6 dark:border-gray-700 dark:bg-gray-900/95">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          className="rounded-lg p-2 text-ts-text-muted hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-ts-text dark:text-white">Welcome back</p>
          <p className="text-xs text-ts-text-muted dark:text-gray-400">
            {user?.email || 'Team member'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-lg p-2 text-ts-text-muted hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          type="button"
          className="relative rounded-lg p-2 text-ts-text-muted hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="hidden items-center gap-3 md:flex">
          <div className="text-right">
            <div className="text-sm font-medium text-ts-text dark:text-white">
              {user?.username || 'User'}
            </div>
            <div className="text-xs capitalize text-ts-text-muted dark:text-gray-400">
              {user?.role || 'member'}
            </div>
          </div>
        </div>

        <Button onClick={handleLogout} variant="outline" size="sm">
          Logout
        </Button>
      </div>
    </header>
  );
}
