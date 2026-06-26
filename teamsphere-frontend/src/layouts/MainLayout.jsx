import { useEffect } from 'react';
import Sidebar from '../sections/Sidebar';
import Topbar from '../sections/Topbar';
import { useUIStore } from '../store/uiStore';

export default function MainLayout({ children }) {
  const { theme, sidebarOpen } = useUIStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="min-h-screen bg-ts-surface-muted dark:bg-gray-950">
      <Sidebar />
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => useUIStore.getState().toggleSidebar()}
        />
      )}
      <div className="flex min-h-screen flex-col lg:ml-64">
        <Topbar />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
