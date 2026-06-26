import { cn } from '../lib/utils';

const controlBase =
  'w-full rounded-[8px] border bg-[var(--color-surface)] text-[var(--color-text)] text-[14px] font-normal transition-[border-color,box-shadow] duration-150 placeholder:text-[var(--color-subtle)] focus:outline-none disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-subtle)] disabled:border-[var(--color-border)] disabled:cursor-not-allowed';

const controlNormal =
  'border-[var(--color-border-strong)] focus:border-[var(--color-primary)] focus:shadow-[0_0_0_3px_var(--color-ring)]';

const controlError =
  'border-[var(--color-danger)] shadow-[0_0_0_3px_color-mix(in_oklch,var(--color-danger)_22%,transparent)] focus:border-[var(--color-danger)] focus:shadow-[0_0_0_3px_color-mix(in_oklch,var(--color-danger)_22%,transparent)]';

export default function Input({
  label,
  error,
  disabled,
  as = 'input',
  icon = null,
  className = '',
  children,
  ...props
}) {
  const hasError = Boolean(error);
  const controlClasses = cn(
    controlBase,
    hasError ? controlError : controlNormal,
    as === 'textarea'
      ? 'min-h-[84px] py-2.5 px-3 leading-[1.55] resize-y'
      : 'h-10 px-3',
    icon && as !== 'textarea' && 'pl-10',
  );

  const Control = as;

  return (
    <div className={className}>
      {label && (
        <label
          className={cn(
            'block font-medium text-[13px] mb-[7px]',
            hasError ? 'text-[var(--color-danger)]' : 'text-[var(--color-text)]',
          )}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && as !== 'textarea' && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-subtle)] pointer-events-none">
            {icon}
          </span>
        )}
        <Control
          className={controlClasses}
          disabled={disabled}
          {...props}
        >
          {children}
        </Control>
      </div>
      {hasError && (
        <p className="text-[12.5px] text-[var(--color-danger)] mt-1.5">{error}</p>
      )}
    </div>
  );
}
