import { useEffect } from 'react';
import { useUIStore } from '../store/uiStore';

export default function AuthLayout({ children }) {
  const theme = useUIStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ts-surface-muted px-4 dark:bg-gray-950">
      <div className="w-full max-w-md rounded-2xl border border-ts-border bg-ts-surface p-8 shadow-lg dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-ts-text dark:text-white">TeamSphere</h1>
          <p className="mt-1 text-sm text-ts-text-muted dark:text-gray-400">
            Manage your team in one place
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
