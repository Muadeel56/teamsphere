import Sidebar from '../sections/Sidebar';
import Topbar from '../sections/Topbar';
import { useUIStore } from '../store/uiStore';

export default function MainLayout({ children }) {
  const sidebarMobileOpen = useUIStore((s) => s.sidebarMobileOpen);
  const setSidebarMobile = useUIStore((s) => s.setSidebarMobile);

  return (
    <div className="min-h-screen bg-ts-surface-muted dark:bg-gray-950">
      <Sidebar />
      {sidebarMobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarMobile(false)}
        />
      )}
      <div className="flex min-h-screen flex-col lg:ml-64">
        <Topbar />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
