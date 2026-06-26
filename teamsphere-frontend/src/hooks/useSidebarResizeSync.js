import { useEffect, useRef } from 'react';
import { useUIStore } from '../store/uiStore';
import { rangeOf } from './useBreakpoint';

export function useSidebarResizeSync() {
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed);
  const rangeRef = useRef(
    typeof window !== 'undefined' ? rangeOf(window.innerWidth) : 'desktop',
  );

  useEffect(() => {
    const applyRange = (range) => {
      if (range === 'tablet') setSidebarCollapsed(true);
      if (range === 'desktop') setSidebarCollapsed(false);
    };

    const sync = (width, force = false) => {
      const range = rangeOf(width);
      if (force || range !== rangeRef.current) {
        applyRange(range);
        rangeRef.current = range;
      }
    };

    sync(window.innerWidth, true);

    const onResize = () => sync(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [setSidebarCollapsed]);
}
