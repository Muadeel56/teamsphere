import { useEffect, useState } from 'react';

export function rangeOf(width) {
  if (width < 768) return 'mobile';
  if (width < 1100) return 'tablet';
  return 'desktop';
}

export function useBreakpoint() {
  const [range, setRange] = useState(() =>
    typeof window !== 'undefined' ? rangeOf(window.innerWidth) : 'desktop',
  );

  useEffect(() => {
    const onResize = () => setRange(rangeOf(window.innerWidth));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return {
    range,
    isMobile: range === 'mobile',
    isTablet: range === 'tablet',
    isDesktop: range === 'desktop',
  };
}
