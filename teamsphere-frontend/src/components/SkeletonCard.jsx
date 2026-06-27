import { cn } from '../lib/utils';

export function SkeletonBlock({ className, style, ...props }) {
  return (
    <div
      className={cn('skeleton-shimmer', className)}
      style={style}
      aria-hidden="true"
      {...props}
    />
  );
}

export function SkeletonCard({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[14px] shadow-[var(--shadow-sm)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
