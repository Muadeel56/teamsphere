import { forwardRef, useState } from 'react';
import { cn } from '../../lib/utils';

const controlBase =
  'w-full rounded-[8px] border bg-[var(--color-surface)] text-[var(--color-text)] text-[14px] font-normal transition-[border-color,box-shadow] duration-150 placeholder:text-[var(--color-subtle)] focus:outline-none disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-subtle)] disabled:border-[var(--color-border)] disabled:cursor-not-allowed';

const controlNormal =
  'border-[var(--color-border-strong)] focus:border-[var(--color-primary)] focus:shadow-[0_0_0_3px_var(--color-ring)]';

const controlError =
  'border-[var(--color-danger)] shadow-[0_0_0_3px_color-mix(in_oklch,var(--color-danger)_22%,transparent)] focus:border-[var(--color-danger)] focus:shadow-[0_0_0_3px_color-mix(in_oklch,var(--color-danger)_22%,transparent)]';

const PasswordField = forwardRef(function PasswordField(
  { label, error, disabled, className = '', ...rest },
  ref,
) {
  const [showPw, setShowPw] = useState(false);
  const hasError = Boolean(error);

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
        <input
          ref={ref}
          type={showPw ? 'text' : 'password'}
          disabled={disabled}
          className={cn(
            controlBase,
            hasError ? controlError : controlNormal,
            'h-11 px-3.5 pr-[62px] text-[14.5px] rounded-[9px]',
          )}
          {...rest}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPw((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-[30px] px-2 rounded-[7px] text-[12px] font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] bg-transparent border-none cursor-pointer transition-colors duration-150"
        >
          {showPw ? 'Hide' : 'Show'}
        </button>
      </div>
      {hasError && (
        <p className="text-[12.5px] text-[var(--color-danger)] mt-1.5">{error}</p>
      )}
    </div>
  );
});

export default PasswordField;
