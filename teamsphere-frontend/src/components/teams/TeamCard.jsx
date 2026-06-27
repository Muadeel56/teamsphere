import { useEffect, useRef } from 'react';
import {
  ChevronRight,
  Eye,
  MoreVertical,
  Trash2,
  Users,
} from 'lucide-react';

import Card from '../Card';
import Badge from '../Badge';
import Avatar, { AvatarGroup } from '../Avatar';
import { getUserInitials } from '../../lib/userInitials';

function RoleCountChips({ roleCounts }) {
  const chips = [
    { key: 'admin', variant: 'admin', count: roleCounts.admin },
    { key: 'manager', variant: 'manager', count: roleCounts.manager },
    { key: 'member', variant: 'member', count: roleCounts.member },
  ].filter((c) => c.count > 0);

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mb-3">
      {chips.map((chip) => (
        <Badge
          key={chip.key}
          variant={chip.variant}
          label={`${chip.count}`}
          dot={false}
          className="!h-[23px] !px-2 !text-[11px] font-mono"
        />
      ))}
    </div>
  );
}

function OverflowAvatar({ count }) {
  return (
    <div
      className="relative inline-grid place-items-center rounded-full font-semibold shrink-0 w-10 h-10 text-[12px] -ml-3 border-[2.5px] border-[var(--color-surface)] bg-[var(--color-surface-2)] text-[var(--color-muted)]"
      aria-label={`${count} more members`}
    >
      +{count}
    </div>
  );
}

export default function TeamCard({
  team,
  animationDelay = '0s',
  kebabOpen = false,
  onKebabToggle,
  onView,
  onDelete,
}) {
  const menuRef = useRef(null);

  useEffect(() => {
    if (!kebabOpen) return undefined;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onKebabToggle?.(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [kebabOpen, onKebabToggle]);

  const members = team.memberUsers ?? [];
  const overflow = members.length > 5 ? members.length - 5 : 0;

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onView?.()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onView?.();
        }
      }}
      className="relative p-5 rounded-[16px] cursor-pointer transition-[transform,box-shadow,border-color] duration-[180ms] ease-out hover:-translate-y-[3px] hover:shadow-[var(--shadow-md)] hover:border-[var(--color-primary)] focus:outline-none focus-visible:shadow-[0_0_0_3px_var(--color-ring)]"
      style={{
        animation: 'ds-rise .45s cubic-bezier(.2,.8,.2,1) both',
        animationDelay,
      }}
    >
      <div className="flex items-start justify-between gap-2.5 mb-[18px]">
        <div className="flex items-center gap-[11px] min-w-0">
          <span
            className="w-10 h-10 rounded-[11px] grid place-items-center font-serif text-[15px] font-semibold flex-none"
            style={{ background: team.tintBg, color: team.tintFg }}
          >
            {team.initial}
          </span>
          <div className="min-w-0">
            <h3 className="font-serif text-[20px] font-semibold leading-tight text-[var(--color-text)] m-0 truncate">
              {team.name}
            </h3>
            {team.createdLabel && (
              <div className="font-mono text-[11.5px] text-[var(--color-subtle)] mt-0.5">
                {team.createdLabel}
              </div>
            )}
          </div>
        </div>
        <div className="relative flex-none" ref={menuRef}>
          <button
            type="button"
            aria-label="Team menu"
            onClick={(e) => {
              e.stopPropagation();
              onKebabToggle?.(kebabOpen ? null : team.id);
            }}
            className="grid place-items-center w-[30px] h-[30px] rounded-lg border-none bg-transparent text-[var(--color-subtle)] cursor-pointer transition-[background,color] duration-150 hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
          >
            <MoreVertical size={18} />
          </button>
          {kebabOpen && (
            <div
              className="absolute right-0 top-[calc(100%+6px)] w-[158px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[10px] shadow-[var(--shadow-lg)] p-1.5 z-30"
              style={{ animation: 'ds-pop .14s cubic-bezier(.2,.8,.2,1)' }}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onKebabToggle?.(null);
                  onView?.();
                }}
                className="w-full flex items-center gap-2 h-9 px-2.5 rounded-[7px] border-none bg-transparent text-[var(--color-text)] text-[13px] font-medium cursor-pointer text-left hover:bg-[var(--color-surface-2)]"
              >
                <Eye size={15} />
                View details
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onKebabToggle?.(null);
                  onDelete?.();
                }}
                className="w-full flex items-center gap-2 h-9 px-2.5 rounded-[7px] border-none bg-transparent text-[var(--color-danger)] text-[13px] font-medium cursor-pointer text-left hover:bg-[var(--color-danger-subtle)]"
              >
                <Trash2 size={15} />
                Delete team
              </button>
            </div>
          )}
        </div>
      </div>

      <RoleCountChips roleCounts={team.roleCounts ?? { admin: 0, manager: 0, member: 0 }} />

      <div className="flex items-center mb-4">
        <AvatarGroup>
          {members.slice(0, 5).map((user) => (
            <Avatar key={user.id} initials={getUserInitials(user)} size="md" />
          ))}
          {overflow > 0 && <OverflowAvatar count={overflow} />}
        </AvatarGroup>
      </div>

      <div className="flex items-center justify-between gap-2.5 pt-3.5 border-t border-[var(--color-border)]">
        <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-muted)]">
          <Users size={15} />
          {team.memberCount ?? members.length} members
        </span>
        <span className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[var(--color-primary)]">
          Open
          <ChevronRight size={14} strokeWidth={2.2} />
        </span>
      </div>
    </Card>
  );
}
