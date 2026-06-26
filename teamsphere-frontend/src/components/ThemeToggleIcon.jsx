import { cn } from '../lib/utils';

export default function ThemeToggleIcon({ className = '', variant = 'default' }) {
  const isAuth = variant === 'auth';
  const size = isAuth ? 15 : 16;

  return (
    <span
      className={cn('inline-block rounded-full', className)}
      style={{
        width: size,
        height: size,
        border: `${isAuth ? 1.5 : 1.6}px solid ${isAuth ? 'var(--color-border-strong)' : 'currentColor'}`,
        background: isAuth
          ? 'linear-gradient(120deg, var(--color-text) 0 50%, transparent 50% 100%)'
          : 'linear-gradient(120deg, currentColor 0 50%, transparent 50% 100%)',
      }}
      aria-hidden="true"
    />
  );
}

export function ThemeToggleButton({
  onClick,
  className = '',
  size = 38,
  rounded = '9px',
  variant = 'default',
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Toggle theme"
      className={cn(
        'grid shrink-0 cursor-pointer place-items-center border border-[var(--color-border-strong)]',
        'bg-[var(--color-surface)] transition-colors',
        variant === 'auth'
          ? 'text-[var(--color-text)] hover:bg-[var(--color-surface-2)]'
          : 'text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]',
        'focus:outline-none focus:shadow-[0_0_0_3px_var(--color-ring)]',
        className,
      )}
      style={{ width: size, height: size, borderRadius: rounded }}
    >
      <ThemeToggleIcon variant={variant} />
    </button>
  );
}
