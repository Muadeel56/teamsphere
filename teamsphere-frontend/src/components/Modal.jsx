import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import Button from './Button';
import { cn } from '../lib/utils';

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  onConfirm,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
}) {
  const titleId = useId();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    const focusable = panelRef.current?.querySelectorAll(FOCUSABLE);
    focusable?.[0]?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const showFooter = footer != null || onConfirm != null;

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="presentation"
    >
      <div
        className="absolute inset-0 bg-[oklch(0.15_0.01_75_/_0.55)] backdrop-blur-sm animate-[ds-overlay-in_0.2s_ease]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={cn(
          'relative w-full max-w-[420px] rounded-[14px] border border-[var(--color-border)]',
          'bg-[var(--color-surface)] p-5 shadow-[var(--shadow-lg)]',
          'animate-[ds-modal-in_0.22s_cubic-bezier(0.2,0.8,0.2,1)]',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 id={titleId} className="font-serif text-[18px] font-semibold text-[var(--color-text)]">
            {title}
          </h2>
        )}
        <div className={cn(title && 'mt-3')}>{children}</div>
        {showFooter && (
          <div className="mt-5 flex justify-end gap-2.5">
            {footer ?? (
              <>
                <Button variant="secondary" size="sm" onClick={onClose}>
                  {cancelLabel}
                </Button>
                <Button
                  variant={danger ? 'danger' : 'primary'}
                  size="sm"
                  onClick={onConfirm}
                >
                  {confirmLabel}
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
