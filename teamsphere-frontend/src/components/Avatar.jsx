import { Children, cloneElement } from 'react';
import { cn } from '../lib/utils';

const AVATAR_COLORS = [
  'oklch(0.495 0.090 183)',
  'oklch(0.56 0.105 262)',
  'oklch(0.55 0.11 150)',
  'oklch(0.555 0.16 25)',
  'oklch(0.70 0.12 75)',
];

const DEFAULT_COLOR = 'oklch(0.495 0.090 183)';

const sizes = {
  sm: 'w-7 h-7 text-[11px]',
  md: 'w-9 h-9 text-[13px]',
  lg: 'w-11 h-11 text-[15px]',
};

function hashInitials(initials) {
  let hash = 0;
  for (let i = 0; i < initials.length; i++) {
    hash = initials.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function getColorFromInitials(initials) {
  const index = hashInitials(initials) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

export default function Avatar({
  initials,
  color,
  size = 'md',
  online = false,
  stacked = false,
  className = '',
}) {
  const displayInitials = initials.slice(0, 2).toUpperCase();
  const bgColor = color ?? getColorFromInitials(displayInitials) ?? DEFAULT_COLOR;

  return (
    <div
      className={cn(
        'relative inline-grid place-items-center rounded-full font-semibold text-white shrink-0',
        sizes[size],
        stacked && '-ml-2.5 border-2 border-[var(--color-surface)]',
        className,
      )}
      style={{ background: bgColor }}
      aria-label={displayInitials}
    >
      {displayInitials}
      {online && (
        <span
          className="absolute -right-px -bottom-px w-[11px] h-[11px] rounded-full bg-[var(--color-success)] border-2 border-[var(--color-surface)]"
          aria-hidden="true"
        />
      )}
    </div>
  );
}

export function AvatarGroup({ children, className = '' }) {
  const items = Children.toArray(children);

  return (
    <div className={cn('flex items-center', className)}>
      {items.map((child, index) =>
        cloneElement(child, { stacked: index > 0, key: child.key ?? index }),
      )}
    </div>
  );
}
