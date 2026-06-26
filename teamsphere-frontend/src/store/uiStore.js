import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUIStore = create(
  persist(
    (set) => ({
      theme: 'light',
      sidebarCollapsed: false,
      sidebarMobileOpen: false,
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarMobile: (open) => set({ sidebarMobileOpen: open }),
    }),
    { name: 'teamsphere-ui' }
  )
);
