import { cn } from '../lib/utils';

export const badgeVariants = {
  todo: {
    label: 'Todo',
    dot: 'var(--color-muted)',
    bg: 'var(--color-surface-2)',
    fg: 'var(--color-muted)',
    border: 'var(--color-border)',
  },
  'in-progress': {
    label: 'In progress',
    dot: 'var(--color-info)',
    bg: 'var(--color-info-subtle)',
    fg: 'var(--color-info)',
    border: 'transparent',
  },
  done: {
    label: 'Done',
    dot: 'var(--color-success)',
    bg: 'var(--color-success-subtle)',
    fg: 'var(--color-success)',
    border: 'transparent',
  },
  'on-hold': {
    label: 'On hold',
    dot: 'var(--color-warning)',
    bg: 'var(--color-warning-subtle)',
    fg: 'var(--color-warning)',
    border: 'transparent',
  },
  admin: {
    label: 'Admin',
    dot: 'var(--color-primary)',
    bg: 'var(--color-primary-subtle)',
    fg: 'var(--color-primary)',
    border: 'transparent',
  },
  manager: {
    label: 'Manager',
    dot: 'var(--color-info)',
    bg: 'var(--color-info-subtle)',
    fg: 'var(--color-info)',
    border: 'transparent',
  },
  member: {
    label: 'Member',
    dot: 'var(--color-muted)',
    bg: 'var(--color-surface-2)',
    fg: 'var(--color-muted)',
    border: 'transparent',
  },
};

export default function Badge({
  variant = 'todo',
  label,
  dot = true,
  className = '',
}) {
  const config = badgeVariants[variant] ?? badgeVariants.todo;
  const displayLabel = label ?? config.label;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-[7px] h-6 px-[11px] rounded-full text-[12px] font-semibold',
        className,
      )}
      style={{
        background: config.bg,
        color: config.fg,
        border: `1px solid ${config.border}`,
      }}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: config.dot }}
        />
      )}
      {displayLabel}
    </span>
  );
}
