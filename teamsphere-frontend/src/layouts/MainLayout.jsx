import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../sections/Sidebar';
import Topbar from '../sections/Topbar';
import { attachViewportListener, useUIStore } from '../store/uiStore';
import { getPageTitle } from '../lib/routeTitles';

function MobileBackdrop({ onClose }) {
  return (
    <button
      type="button"
      aria-label="Close sidebar"
      className="fixed inset-0 z-[55] animate-[ds-fade_.2s_ease] border-none bg-[oklch(0.12_0.01_80/0.5)] backdrop-blur-[2px] md:hidden"
      onClick={onClose}
    />
  );
}

export default function MainLayout() {
  const location = useLocation();
  const theme = useUIStore((s) => s.theme);
  const sidebarMobileOpen = useUIStore((s) => s.sidebarMobileOpen);
  const setSidebarMobile = useUIStore((s) => s.setSidebarMobile);

  useEffect(() => attachViewportListener(), []);

  useEffect(() => {
    setSidebarMobile(false);
  }, [location.pathname, setSidebarMobile]);

  const pageTitle = getPageTitle(location.pathname);

  return (
    <div data-theme={theme} className="flex min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Sidebar />
      {sidebarMobileOpen && <MobileBackdrop onClose={() => setSidebarMobile(false)} />}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={pageTitle} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1080px] px-4 py-6 md:px-6 lg:px-8 lg:py-9">
            <div
              key={location.pathname}
              style={{ animation: 'ds-rise .4s cubic-bezier(.2,.8,.2,1) both' }}
            >
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
