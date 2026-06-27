import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { UserPlus, X } from 'lucide-react';

import Avatar from '../Avatar';
import Badge from '../Badge';
import Button from '../Button';
import {
  canManageMembers,
  canRemoveMember,
  formatMemberJoinDate,
} from '../../lib/teamHelpers';
import { getUserDisplayName, getUserInitials } from '../../lib/userInitials';

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const selectClasses =
  'h-8 px-2 rounded-[7px] border border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-text)] text-[12px] font-normal transition-[border-color,box-shadow] duration-150 focus:outline-none focus:border-[var(--color-primary)] focus:shadow-[0_0_0_3px_var(--color-ring)] disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-subtle)] disabled:cursor-not-allowed';

export default function TeamDetailDrawer({
  open,
  team,
  currentUser,
  onClose,
  onInvite,
  onRoleChange,
  onRemoveMember,
}) {
  const titleId = useId();
  const panelRef = useRef(null);
  const members = team?.memberUsers ?? [];
  const manageMembers = canManageMembers(currentUser);

  useEffect(() => {
    if (!open) return undefined;

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

  if (!open || !team) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[88] bg-[oklch(0.15_0.01_75_/_0.5)] backdrop-blur-[3px] animate-[ds-overlay-in_0.2s_ease]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="fixed top-0 right-0 bottom-0 z-[89] w-full sm:w-[440px] max-w-[100vw] bg-[var(--color-surface)] border-l border-[var(--color-border)] shadow-[var(--shadow-lg)] flex flex-col animate-[ds-drawer-in_0.3s_cubic-bezier(.4,0,.2,1)]"
      >
        <div className="flex-none p-6 border-b border-[var(--color-border)]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <span
                className="w-[52px] h-[52px] rounded-[14px] grid place-items-center font-serif text-[20px] font-semibold flex-none"
                style={{ background: team.tintBg, color: team.tintFg }}
              >
                {team.initial}
              </span>
              <div className="min-w-0">
                <h3
                  id={titleId}
                  className="font-serif text-[23px] font-medium leading-tight tracking-[-0.008em] text-[var(--color-text)] m-0 truncate"
                >
                  {team.name}
                </h3>
                <div className="font-mono text-[12px] text-[var(--color-subtle)] mt-0.5">
                  {team.memberCount} members · {team.createdLabel || '—'}
                </div>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="grid place-items-center w-[34px] h-[34px] rounded-[9px] border border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-muted)] cursor-pointer flex-none hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="flex items-center justify-between my-2 mb-3">
            <span className="font-mono text-[12px] font-medium tracking-[0.1em] uppercase text-[var(--color-subtle)]">
              Members
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {members.map((member) => {
              const removable = canRemoveMember(member, members, currentUser);
              return (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-3 border border-[var(--color-border)] rounded-[11px] bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)] transition-colors"
                >
                  <Avatar initials={getUserInitials(member)} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13.5px] font-semibold text-[var(--color-text)] truncate">
                      {getUserDisplayName(member)}
                    </div>
                    <div className="text-[12px] text-[var(--color-muted)] truncate">
                      {member.email || '—'}
                    </div>
                    <div className="font-mono text-[11px] text-[var(--color-subtle)] mt-0.5">
                      Joined {formatMemberJoinDate(member)}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-none">
                    <Badge variant={member.role || 'member'} dot />
                    {manageMembers && (
                      <div className="flex items-center gap-2">
                        <select
                          aria-label={`Change role for ${getUserDisplayName(member)}`}
                          className={selectClasses}
                          value={member.role || 'member'}
                          onChange={(e) => onRoleChange?.(member.id, e.target.value)}
                        >
                          <option value="admin">Admin</option>
                          <option value="manager">Manager</option>
                          <option value="member">Member</option>
                        </select>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="!text-[var(--color-danger)]"
                          disabled={!removable}
                          onClick={() => onRemoveMember?.(member.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {manageMembers && (
            <>
              <p className="text-[11.5px] text-[var(--color-subtle)] mt-3 mb-2">
                Role changes update this user&apos;s workspace role, not a per-team role.
              </p>
              <button
                type="button"
                onClick={onInvite}
                className="w-full mt-2 flex items-center justify-center gap-2 h-[46px] rounded-[11px] border-[1.5px] border-dashed border-[var(--color-border-strong)] bg-transparent text-[var(--color-primary)] text-[13.5px] font-semibold cursor-pointer transition-[background,border-color] duration-150 hover:bg-[var(--color-primary-subtle)] hover:border-[var(--color-primary)]"
              >
                <UserPlus size={17} />
                Invite member
              </button>
            </>
          )}
        </div>
      </div>
    </>,
    document.body,
  );
}
