import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../sections/Sidebar';
import Topbar from '../sections/Topbar';
import { useUIStore } from '../store/uiStore';
import { useSidebarResizeSync } from '../hooks/useSidebarResizeSync';
import { getPageTitle } from '../lib/routeTitles';

function MobileBackdrop({ onClose }) {
  return (
    <button
      type="button"
      aria-label="Close sidebar"
      className="fixed inset-0 z-[55] animate-[ds-fade_.2s_ease] border-none bg-[oklch(0.12_0.01_80/0.5)] backdrop-blur-[2px] lg:hidden"
      onClick={onClose}
    />
  );
}

export default function MainLayout() {
  const location = useLocation();
  const theme = useUIStore((s) => s.theme);
  const sidebarMobileOpen = useUIStore((s) => s.sidebarMobileOpen);
  const setSidebarMobile = useUIStore((s) => s.setSidebarMobile);

  useSidebarResizeSync();

  const pageTitle = getPageTitle(location.pathname);

  return (
    <div data-theme={theme} className="flex min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Sidebar />
      {sidebarMobileOpen && <MobileBackdrop onClose={() => setSidebarMobile(false)} />}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={pageTitle} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1080px] px-8 py-9">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
