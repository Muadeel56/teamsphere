import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LogoMark from '../components/LogoMark';
import { ThemeToggleButton } from '../components/ThemeToggleIcon';
import { useUIStore } from '../store/uiStore';
import { cn } from '../lib/utils';

const AUTH_NARROW_BREAKPOINT = 880;

const AUTH_TABS = [
  { label: 'Log in', path: '/login' },
  { label: 'Sign up', path: '/register' },
  { label: 'Reset', path: '/forgot-password' },
];

function AuthTab({ to, label, active }) {
  return (
    <Link
      to={to}
      className={cn(
        'inline-flex h-[30px] items-center rounded-full px-[13px] text-[12.5px] font-semibold transition-colors duration-150',
        active
          ? 'bg-[var(--color-primary-subtle)] text-[var(--color-primary)]'
          : 'bg-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]',
      )}
    >
      {label}
    </Link>
  );
}

function DecorativePanel({ isNarrow }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden',
        isNarrow ? 'order-first h-[132px] w-full shrink-0' : 'min-h-screen shrink-0 basis-[46%]',
      )}
      style={{ background: 'linear-gradient(155deg, var(--panel-1), var(--panel-2))' }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(var(--panel-line) 1px, transparent 1px), linear-gradient(90deg, var(--panel-line) 1px, transparent 1px)',
          backgroundSize: '42px 42px',
        }}
      />
      <div
        className="absolute h-[520px] w-[520px] rounded-full blur-[24px]"
        style={{
          top: -130,
          right: -120,
          background: 'radial-gradient(circle, var(--panel-glow), transparent 62%)',
          animation: 'ds-glow 9s ease-in-out infinite alternate',
        }}
      />
      <div
        className="absolute h-[380px] w-[380px] rounded-full opacity-50 blur-[28px]"
        style={{
          bottom: -140,
          left: -110,
          background: 'radial-gradient(circle, var(--panel-glow), transparent 64%)',
          animation: 'ds-glow 11s ease-in-out infinite alternate',
        }}
      />

      {!isNarrow ? (
        <div className="absolute inset-0">
          <div className="absolute top-[34px] left-[38px] z-[4] flex items-center gap-2.5">
            <div className="grid h-[30px] w-[30px] place-items-center rounded-lg bg-[var(--panel-accent)]">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <circle cx="9" cy="4.4" r="2.1" fill="var(--panel-2)" />
                <circle cx="4.2" cy="13" r="2.1" fill="var(--panel-2)" />
                <circle cx="13.8" cy="13" r="2.1" fill="var(--panel-2)" />
              </svg>
            </div>
            <span className="font-serif text-[17px] font-semibold text-[var(--panel-text)]">TeamSphere</span>
          </div>

          <div
            className="absolute top-[31%] left-[9%] z-[3] w-[266px] rounded-[14px] border border-[var(--panel-cardborder)] p-4 shadow-[0_24px_50px_-16px_rgba(0,0,0,0.5)] backdrop-blur-[10px]"
            style={{
              background: 'var(--panel-card)',
              animation: 'ds-floatA 6s ease-in-out infinite alternate',
            }}
          >
            <div className="mb-3 flex items-center justify-between">
              <span
                className="inline-flex h-[22px] items-center gap-1.5 rounded-full px-2 text-[11px] font-semibold text-[var(--panel-accent)]"
                style={{ background: 'color-mix(in oklch, var(--panel-accent) 18%, transparent)' }}
              >
                <span className="h-[5px] w-[5px] rounded-full bg-[var(--panel-accent)]" />
                In progress
              </span>
              <span className="font-mono text-[11px] text-[var(--panel-muted)]">68%</span>
            </div>
            <div className="mb-3 font-serif text-base font-semibold text-[var(--panel-text)]">Q3 Product Launch</div>
            <div className="mb-3.5 h-1.5 overflow-hidden rounded-full bg-[var(--panel-line)]">
              <div className="h-full w-[68%] rounded-full bg-[var(--panel-accent)]" />
            </div>
            <div className="flex items-center">
              {['oklch(0.62 0.11 180)', 'oklch(0.56 0.105 262)', 'oklch(0.555 0.16 25)'].map((color, i) => (
                <div
                  key={color}
                  className="h-6 w-6 rounded-full border-2 border-[var(--panel-2)]"
                  style={{ background: color, marginLeft: i > 0 ? -8 : 0 }}
                />
              ))}
              <div className="-ml-2 grid h-6 w-6 place-items-center rounded-full border-2 border-[var(--panel-2)] bg-[var(--panel-line)] text-[9px] font-semibold text-[var(--panel-text)]">
                +4
              </div>
            </div>
          </div>

          <div
            className="absolute top-[17%] right-[11%] z-[3] w-[212px] rounded-[14px] border border-[var(--panel-cardborder)] p-[15px] shadow-[0_24px_50px_-16px_rgba(0,0,0,0.5)] backdrop-blur-[10px]"
            style={{
              background: 'var(--panel-card)',
              animation: 'ds-floatB 7s ease-in-out infinite alternate',
            }}
          >
            <div className="mb-[11px] flex items-center gap-2">
              <span
                className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full"
                style={{ background: 'color-mix(in oklch, oklch(0.55 0.11 150) 28%, transparent)' }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6.2l2.2 2.3L9.5 3.5" stroke="oklch(0.79 0.12 155)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="text-[13.5px] font-semibold text-[var(--panel-text)]">Design QA signed off</span>
            </div>
            <div className="text-xs text-[var(--panel-muted)]">Mikhail · 12 min ago</div>
          </div>

          <div
            className="absolute right-[15%] bottom-[23%] z-[3] w-[230px] rounded-[14px] border border-[var(--panel-cardborder)] p-[15px] shadow-[0_24px_50px_-16px_rgba(0,0,0,0.5)] backdrop-blur-[10px]"
            style={{
              background: 'var(--panel-card)',
              animation: 'ds-floatC 5.5s ease-in-out infinite alternate',
            }}
          >
            <span className="mb-[11px] inline-flex h-[22px] items-center gap-1.5 rounded-full bg-[var(--panel-line)] px-2 text-[11px] font-semibold text-[var(--panel-muted)]">
              <span className="h-[5px] w-[5px] rounded-full bg-[var(--panel-muted)]" />
              Todo
            </span>
            <div className="mb-2.5 text-sm font-semibold text-[var(--panel-text)]">Onboarding flow</div>
            <div className="mb-[7px] h-[7px] w-4/5 rounded-full bg-[var(--panel-line)]" />
            <div className="h-[7px] w-[55%] rounded-full bg-[var(--panel-line)]" />
          </div>

          <div className="absolute right-[38px] bottom-[42px] left-[38px] z-[4]">
            <h2 className="m-0 mb-3 max-w-[14ch] font-serif text-[34px] leading-[1.2] font-medium tracking-[-0.01em] text-[var(--panel-text)]">
              Where teams keep momentum.
            </h2>
            <p className="m-0 max-w-[40ch] text-[15px] leading-[1.6] text-[var(--panel-muted)]">
              Projects, tasks, and attendance on one calm surface your team actually enjoys opening.
            </p>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 z-[4] flex items-center justify-between px-[22px]">
          <div className="flex items-center gap-2">
            <div className="grid h-[26px] w-[26px] place-items-center rounded-[7px] bg-[var(--panel-accent)]">
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <circle cx="9" cy="4.4" r="2.1" fill="var(--panel-2)" />
                <circle cx="4.2" cy="13" r="2.1" fill="var(--panel-2)" />
                <circle cx="13.8" cy="13" r="2.1" fill="var(--panel-2)" />
              </svg>
            </div>
            <span className="font-serif text-base font-semibold text-[var(--panel-text)]">TeamSphere</span>
          </div>
          <span className="text-[12.5px] text-[var(--panel-muted)]">Keep momentum.</span>
        </div>
      )}
    </div>
  );
}

export default function AuthLayout({ children }) {
  const location = useLocation();
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const [isNarrow, setIsNarrow] = useState(
    typeof window !== 'undefined' ? window.innerWidth < AUTH_NARROW_BREAKPOINT : false,
  );

  useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth < AUTH_NARROW_BREAKPOINT);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div
      data-theme={theme}
      className={cn(
        'flex min-h-screen bg-[var(--color-bg)] font-sans text-[var(--color-text)] antialiased transition-[background,color] duration-350',
        isNarrow ? 'flex-col' : 'flex-row',
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center justify-between gap-3.5 px-7 py-[22px]">
          <div className="flex items-center gap-[11px]">
            <LogoMark size={32} />
            <span className="font-serif text-lg font-semibold tracking-[-0.005em]">TeamSphere</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex gap-0.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] p-[3px]">
              {AUTH_TABS.map((tab) => (
                <AuthTab
                  key={tab.path}
                  to={tab.path}
                  label={tab.label}
                  active={location.pathname === tab.path}
                />
              ))}
            </div>
            <ThemeToggleButton onClick={toggleTheme} size={36} rounded="999px" variant="auth" />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-7 pt-[18px] pb-9">
          <div className="w-full max-w-[412px]">{children}</div>
        </div>

        <div className="px-7 pb-[26px] text-center font-mono text-xs tracking-[0.04em] text-[var(--color-subtle)]">
          © {new Date().getFullYear()} TeamSphere · Secure sign-in
        </div>
      </div>

      <DecorativePanel isNarrow={isNarrow} />
    </div>
  );
}
