import { cn } from '../lib/utils';

export const variants = {
  primary:
    'bg-[var(--color-primary)] text-[var(--color-primary-fg)] hover:bg-[var(--color-primary-hover)] border-transparent',
  secondary:
    'bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border-strong)] hover:bg-[var(--color-surface-2)]',
  ghost:
    'bg-transparent text-[var(--color-text)] border-transparent hover:bg-[var(--color-surface-2)]',
  danger:
    'bg-[var(--color-danger)] text-[var(--color-danger-fg)] hover:bg-[var(--color-danger-hover)] border-transparent',
};

export const sizes = {
  sm: 'h-8 px-3 text-[13px] rounded-[7px]',
  md: 'h-10 px-[18px] text-[14px] rounded-[8px]',
  lg: 'h-12 px-6 text-[15px] rounded-[9px]',
};

const iconOnlySizes = {
  sm: 'w-8 h-8 p-0',
  md: 'w-10 h-10 p-0',
  lg: 'w-12 h-12 p-0',
};

const spinnerColors = {
  primary: 'border-white border-t-transparent',
  secondary: 'border-current border-t-transparent',
  ghost: 'border-current border-t-transparent',
  danger: 'border-white border-t-transparent',
};

const baseClasses =
  'inline-flex items-center justify-center gap-2 border font-semibold transition-[background,transform] duration-150 focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_var(--color-ring)] active:translate-y-px disabled:opacity-45 disabled:cursor-not-allowed disabled:active:translate-y-0';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  icon = null,
  ...props
}) {
  const resolvedVariant = variant === 'outline' ? 'secondary' : variant;
  const isIconOnly = !children && icon;

  return (
    <button
      className={cn(
        baseClasses,
        variants[resolvedVariant],
        isIconOnly ? iconOnlySizes[size] : sizes[size],
        className,
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span
          className={cn(
            'h-4 w-4 animate-spin rounded-full border-2',
            spinnerColors[resolvedVariant],
          )}
          aria-hidden="true"
        />
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
}
