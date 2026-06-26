import { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  ChevronRight,
  Check,
  UserPlus,
  Clock,
} from 'lucide-react';
import { ThemeToggleButton } from '../components/ThemeToggleIcon';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { useUIStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';
import { getUserInitials } from '../lib/userInitials';
import { cn } from '../lib/utils';

const NOTIFICATIONS = [
  {
    id: 1,
    icon: Check,
    iconBg: 'bg-[var(--color-success-subtle)]',
    iconColor: 'text-[var(--color-success)]',
    text: (
      <>
        Mikhail signed off Design QA on <b>Q3 Launch</b>
      </>
    ),
    time: '12 min ago',
  },
  {
    id: 2,
    icon: UserPlus,
    iconBg: 'bg-[var(--color-info-subtle)]',
    iconColor: 'text-[var(--color-info)]',
    text: (
      <>
        Jordan was added to <b>Platform</b> team
      </>
    ),
    time: '1 hr ago',
  },
  {
    id: 3,
    icon: Clock,
    iconBg: 'bg-[var(--color-warning-subtle)]',
    iconColor: 'text-[var(--color-warning)]',
    text: '3 tasks are due today across your projects',
    time: '2 hr ago',
  },
];

export default function Topbar({ title }) {
  const { isMobile } = useBreakpoint();
  const user = useAuthStore((s) => s.user);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const sidebarMobileOpen = useUIStore((s) => s.sidebarMobileOpen);
  const setSidebarMobile = useUIStore((s) => s.setSidebarMobile);

  const [notifOpen, setNotifOpen] = useState(false);
  const initials = getUserInitials(user);

  const toggleNotif = () => setNotifOpen((open) => !open);
  const closePopovers = () => setNotifOpen(false);

  return (
    <>
      {notifOpen && (
        <button
          type="button"
          aria-label="Close notifications"
          className="fixed inset-0 z-[35] cursor-default border-none bg-transparent"
          onClick={closePopovers}
        />
      )}

      <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-3.5 border-b border-[var(--color-border)] bg-[var(--topbar-bg)] px-6 backdrop-blur-[14px]">
        {isMobile && (
          <button
            type="button"
            onClick={() => setSidebarMobile(!sidebarMobileOpen)}
            aria-label="Open menu"
            className={cn(
              'grid h-[38px] w-[38px] shrink-0 cursor-pointer place-items-center rounded-[9px]',
              'border border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-text)]',
              'hover:bg-[var(--color-surface-2)] focus:outline-none focus:shadow-[0_0_0_3px_var(--color-ring)]',
            )}
          >
            <Menu size={19} />
          </button>
        )}

        <div className="min-w-0">
          <div className="mb-px flex items-center gap-[7px] font-mono text-xs font-medium text-[var(--color-subtle)]">
            <span>Workspace</span>
            <ChevronRight size={12} />
            <span className="text-[var(--color-muted)]">{title}</span>
          </div>
          <h1 className="m-0 truncate font-serif text-[22px] leading-[1.1] font-medium tracking-[-0.008em] text-[var(--color-text)]">
            {title}
          </h1>
        </div>

        <div className="flex-1" />

        {!isMobile ? (
          <button
            type="button"
            aria-label="Search"
            className={cn(
              'flex h-[38px] min-w-[210px] cursor-pointer items-center gap-2.5 rounded-[9px] border border-[var(--color-border-strong)]',
              'bg-[var(--color-surface)] px-[13px] text-[var(--color-muted)] transition-colors',
              'hover:bg-[var(--color-surface-2)] focus:outline-none focus:shadow-[0_0_0_3px_var(--color-ring)]',
            )}
          >
            <Search size={16} className="shrink-0" />
            <span className="flex-1 text-left text-sm">Search…</span>
            <span className="rounded-[5px] border border-[var(--color-border)] px-1.5 py-0.5 font-mono text-[11px] font-medium text-[var(--color-subtle)]">
              ⌘K
            </span>
          </button>
        ) : (
          <button
            type="button"
            aria-label="Search"
            className={cn(
              'grid h-[38px] w-[38px] shrink-0 cursor-pointer place-items-center rounded-[9px]',
              'border border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-muted)]',
              'hover:bg-[var(--color-surface-2)]',
            )}
          >
            <Search size={17} />
          </button>
        )}

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={toggleNotif}
            aria-label="Notifications"
            className={cn(
              'relative grid h-[38px] w-[38px] cursor-pointer place-items-center rounded-[9px]',
              'border border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-muted)]',
              'hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]',
              'focus:outline-none focus:shadow-[0_0_0_3px_var(--color-ring)]',
            )}
          >
            <Bell size={18} />
            <span className="absolute top-2 right-[9px] h-2 w-2 rounded-full border-2 border-[var(--color-surface)] bg-[var(--color-danger)]" />
          </button>

          {notifOpen && (
            <div className="absolute top-[calc(100%+10px)] right-0 z-[70] w-[312px] animate-[ds-pop_.16s_cubic-bezier(.2,.8,.2,1)] overflow-hidden rounded-[13px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-lg)]">
              <div className="flex items-center justify-between border-b border-[var(--color-border)] px-[15px] py-[13px]">
                <span className="text-sm font-semibold text-[var(--color-text)]">Notifications</span>
                <span className="rounded-full bg-[var(--color-primary-subtle)] px-2 py-0.5 text-[11px] font-semibold text-[var(--color-primary)]">
                  3 new
                </span>
              </div>

              {NOTIFICATIONS.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className={cn(
                      'flex items-start gap-[11px] px-[15px] py-[13px]',
                      index < NOTIFICATIONS.length - 1 && 'border-b border-[var(--color-border)]',
                    )}
                  >
                    <span
                      className={cn(
                        'grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full',
                        item.iconBg,
                        item.iconColor,
                      )}
                    >
                      <Icon size={15} />
                    </span>
                    <div>
                      <div className="text-[13px] leading-[1.4] font-medium text-[var(--color-text)]">
                        {item.text}
                      </div>
                      <div className="mt-[3px] font-mono text-[11.5px] text-[var(--color-subtle)]">
                        {item.time}
                      </div>
                    </div>
                  </div>
                );
              })}

              <button
                type="button"
                className="h-[42px] w-full cursor-pointer border-t border-[var(--color-border)] bg-[var(--color-surface)] text-[13px] font-semibold text-[var(--color-primary)] hover:bg-[var(--color-surface-2)]"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>

        <ThemeToggleButton onClick={toggleTheme} />

        <div className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full border-2 border-[var(--color-surface)] bg-[var(--color-primary)] text-[13px] font-semibold text-[var(--color-primary-fg)] shadow-[var(--shadow-sm)]">
          {initials}
        </div>
      </header>
    </>
  );
}
