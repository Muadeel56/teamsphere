import { useUIStore } from '../store/uiStore';
import { rangeOf } from '../lib/breakpoints';

export { rangeOf };

export function useBreakpoint() {
  const range = useUIStore((s) => s.viewportRange);

  return {
    range,
    isMobile: range === 'mobile',
    isTablet: range === 'tablet',
    isDesktop: range === 'desktop',
  };
}
