import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  ListChecks,
  Users,
  Clock,
  ChevronsLeft,
  ChevronUp,
  User,
  LogOut,
} from 'lucide-react';
import LogoMark from '../components/LogoMark';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { useUIStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';
import { getUserDisplayName, getUserInitials } from '../lib/userInitials';
import { cn } from '../lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Tasks', href: '/tasks', icon: ListChecks },
  { name: 'Teams', href: '/teams', icon: Users },
  { name: 'Attendance', href: '/attendance', icon: Clock },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint();
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed);
  const sidebarMobileOpen = useUIStore((s) => s.sidebarMobileOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const setSidebarMobile = useUIStore((s) => s.setSidebarMobile);
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);

  const rail = sidebarCollapsed && !isMobile;
  const initials = getUserInitials(user);
  const displayName = getUserDisplayName(user);
  const themeMenuLabel = theme === 'dark' ? 'Switch to light' : 'Switch to dark';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavClick = () => {
    if (isMobile) setSidebarMobile(false);
    setUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen((open) => !open);
  };

  return (
    <>
      {userMenuOpen && (
        <button
          type="button"
          aria-label="Close user menu"
          className="fixed inset-0 z-[55] cursor-default border-none bg-transparent"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    <aside
      className={cn(
        'z-[60] flex flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)]',
        isMobile
          ? 'fixed top-0 left-0 h-screen w-[286px] transition-transform duration-300 ease-[cubic-bezier(.4,0,.2,1)]'
          : 'sticky top-0 h-screen shrink-0 transition-[width] duration-[280ms] ease-[cubic-bezier(.4,0,.2,1)]',
        isMobile && (sidebarMobileOpen ? 'translate-x-0 shadow-[var(--shadow-lg)]' : '-translate-x-[106%]'),
        !isMobile && (rail ? 'w-[76px]' : 'w-[264px]'),
      )}
    >
      {/* Brand row */}
      <div
        className={cn(
          'flex h-16 shrink-0 items-center gap-[11px] border-b border-[var(--color-border)]',
          rail ? 'justify-center px-0' : 'justify-start px-4',
        )}
      >
        <LogoMark />
        {!rail && (
          <span className="font-serif text-[19px] font-semibold tracking-[-0.005em] whitespace-nowrap text-[var(--color-text)]">
            TeamSphere
          </span>
        )}
        {!rail && !isMobile && (
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Collapse sidebar"
            className={cn(
              'ml-auto grid h-[30px] w-[30px] cursor-pointer place-items-center rounded-lg',
              'border border-transparent bg-transparent text-[var(--color-muted)]',
              'transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]',
              'focus:outline-none focus:shadow-[0_0_0_3px_var(--color-ring)]',
            )}
          >
            <ChevronsLeft size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav
        className={cn(
          'flex flex-1 flex-col gap-1 overflow-x-hidden overflow-y-auto py-3.5',
          rail ? 'px-3' : 'px-3',
        )}
      >
        {!rail && (
          <div className="px-3 pt-1.5 pb-2 font-mono text-[11px] font-medium tracking-[0.12em] text-[var(--color-subtle)] uppercase">
            Workspace
          </div>
        )}

        {navigation.map((item) => {
          const Icon = item.icon;
          const showTooltip = rail && hoveredNav === item.href;

          return (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/dashboard'}
              onClick={handleNavClick}
              onMouseEnter={() => setHoveredNav(item.href)}
              onMouseLeave={() => setHoveredNav(null)}
              className={({ isActive }) =>
                cn(
                  'relative flex h-[42px] items-center gap-3 rounded-[9px] transition-colors duration-150',
                  rail ? 'justify-center px-0' : 'justify-start px-3',
                  isActive
                    ? 'bg-[var(--color-primary-subtle)] text-[var(--color-primary)]'
                    : 'text-[var(--color-muted)] hover:bg-[var(--color-surface-2)]',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      'absolute top-1/2 left-0 h-[22px] w-[3px] -translate-y-1/2 rounded-r-[3px]',
                      'bg-[var(--color-primary)] transition-opacity duration-200',
                      isActive ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <Icon size={20} className="shrink-0" />
                  {!rail && (
                    <span className={cn('text-[14.5px] whitespace-nowrap', isActive ? 'font-semibold' : 'font-medium')}>
                      {item.name}
                    </span>
                  )}
                  {showTooltip && (
                    <span
                      className="absolute top-1/2 left-[calc(100%+14px)] z-[70] -translate-y-1/2 animate-[ds-fade_.12s_ease] rounded-[7px] bg-[var(--color-text)] px-2.5 py-1.5 text-[12.5px] font-semibold whitespace-nowrap text-[var(--color-bg)] shadow-[var(--shadow-md)]"
                    >
                      {item.name}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="relative shrink-0 border-t border-[var(--color-border)] p-3">
        {userMenuOpen && (
          <div className="absolute right-3 bottom-[calc(100%+8px)] left-3 z-[70] min-w-[208px] animate-[ds-pop_.16s_cubic-bezier(.2,.8,.2,1)] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-1.5 shadow-[var(--shadow-lg)]">
            <button
              type="button"
              onClick={() => setUserMenuOpen(false)}
              className="flex h-10 w-full cursor-pointer items-center gap-[11px] rounded-lg border-none bg-transparent px-[11px] text-left text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-2)]"
            >
              <User size={17} />
              Profile &amp; settings
            </button>
            <button
              type="button"
              onClick={() => {
                toggleTheme();
                setUserMenuOpen(false);
              }}
              className="flex h-10 w-full cursor-pointer items-center gap-[11px] rounded-lg border-none bg-transparent px-[11px] text-left text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-2)]"
            >
              <span className="inline-block h-[17px] w-[17px] rounded-full border-[1.5px] border-current bg-[linear-gradient(120deg,currentColor_0_50%,transparent_50%_100%)]" />
              {themeMenuLabel}
            </button>
            <div className="mx-1 my-1.5 h-px bg-[var(--color-border)]" />
            <button
              type="button"
              onClick={handleLogout}
              className="flex h-10 w-full cursor-pointer items-center gap-[11px] rounded-lg border-none bg-transparent px-[11px] text-left text-sm font-medium text-[var(--color-danger)] hover:bg-[var(--color-danger-subtle)]"
            >
              <LogOut size={17} />
              Log out
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={toggleUserMenu}
          className={cn(
            'flex h-[52px] w-full cursor-pointer items-center gap-[11px] rounded-[11px] transition-colors duration-150',
            rail ? 'justify-center px-0' : 'justify-start px-[9px]',
            userMenuOpen
              ? 'border border-[var(--color-border)] bg-[var(--color-surface-2)]'
              : 'border border-transparent bg-transparent hover:bg-[var(--color-surface-2)]',
          )}
        >
          <div className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-[var(--color-primary)] text-[13px] font-semibold text-[var(--color-primary-fg)]">
            {initials}
          </div>
          {!rail && (
            <>
              <div className="min-w-0 flex-1 text-left">
                <div className="truncate text-[13.5px] leading-[1.2] font-semibold text-[var(--color-text)]">
                  {displayName}
                </div>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="inline-flex h-[17px] items-center gap-[5px] rounded-full bg-[var(--color-primary-subtle)] px-[7px] text-[10px] font-semibold text-[var(--color-primary)]">
                    <span className="h-1 w-1 rounded-full bg-[var(--color-primary)]" />
                    Admin
                  </span>
                </div>
              </div>
              <ChevronUp size={16} className="shrink-0 text-[var(--color-subtle)]" />
            </>
          )}
        </button>
      </div>
    </aside>
    </>
  );
}
