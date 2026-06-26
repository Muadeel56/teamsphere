import { cn } from '../lib/utils';

export default function Card({ children, className = '', ...props }) {
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
