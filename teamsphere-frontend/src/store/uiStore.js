import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { rangeOf } from '../lib/breakpoints';

const initialWidth = typeof window !== 'undefined' ? window.innerWidth : 1100;

export const useUIStore = create(
  persist(
    (set) => ({
      theme: 'light',
      sidebarCollapsed: false,
      sidebarMobileOpen: false,
      viewportRange: rangeOf(initialWidth),
      windowWidth: initialWidth,
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setSidebarMobile: (open) => set({ sidebarMobileOpen: open }),
      syncViewport: (width) =>
        set((state) => {
          const range = rangeOf(width);
          const rangeChanged = range !== state.viewportRange;

          if (!rangeChanged && state.windowWidth === width) {
            return state;
          }

          const next = {
            viewportRange: range,
            windowWidth: width,
          };

          if (rangeChanged) {
            if (range === 'tablet') next.sidebarCollapsed = true;
            if (range === 'desktop') next.sidebarCollapsed = false;
            if (range === 'mobile') next.sidebarMobileOpen = false;
          }

          return { ...state, ...next };
        }),
    }),
    {
      name: 'teamsphere-ui',
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    },
  ),
);

export function attachViewportListener() {
  if (typeof window === 'undefined') return () => {};

  const { syncViewport } = useUIStore.getState();
  syncViewport(window.innerWidth);

  const onResize = () => syncViewport(window.innerWidth);
  window.addEventListener('resize', onResize);
  return () => window.removeEventListener('resize', onResize);
}
