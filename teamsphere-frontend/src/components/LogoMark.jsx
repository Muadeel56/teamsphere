import { cn } from '../lib/utils';

export default function LogoMark({ size = 34, className = '' }) {
  const iconSize = Math.round(size * 0.53);

  return (
    <div
      className={cn(
        'grid shrink-0 place-items-center rounded-[9px] bg-[var(--color-primary)] shadow-[var(--shadow-sm)]',
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg width={iconSize} height={iconSize} viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <circle cx="9" cy="4.4" r="2.1" fill="var(--color-primary-fg)" />
        <circle cx="4.2" cy="13" r="2.1" fill="var(--color-primary-fg)" />
        <circle cx="13.8" cy="13" r="2.1" fill="var(--color-primary-fg)" />
      </svg>
    </div>
  );
}
