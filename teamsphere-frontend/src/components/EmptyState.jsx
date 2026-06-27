import Button from './Button';

export default function EmptyState({
  eyebrow,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
  icon,
  variant = 'default',
  secondaryAction,
}) {
  if (variant === 'filtered') {
    return (
      <div className="text-center py-16 px-6 border-[1.5px] border-dashed border-[var(--color-border-strong)] rounded-[18px] bg-[var(--color-surface)]">
        <p className="text-[15px] text-[var(--color-muted)] m-0">{description}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center px-6 py-16 border-[1.5px] border-dashed border-[var(--color-border-strong)] rounded-[18px] bg-[var(--color-surface)]">
      {eyebrow && (
        <p className="font-mono text-xs font-medium uppercase tracking-[0.1em] text-[var(--color-subtle)] m-0 mb-3">
          {eyebrow}
        </p>
      )}
      {icon}
      <h3 className="font-serif text-[24px] font-medium tracking-[-0.01em] text-[var(--color-text)] m-0 mb-2.5">
        {title}
      </h3>
      <p className="text-[15px] leading-[1.6] text-[var(--color-muted)] m-0 mb-[26px] max-w-[42ch]">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} icon={actionIcon}>
          {actionLabel}
        </Button>
      )}
      {secondaryAction}
    </div>
  );
}
