import { LogIn } from 'lucide-react';

export default function HeaderClockButton({
  isClockedIn,
  elapsed,
  loading,
  onCheckIn,
  onCheckOut,
}) {
  const label = isClockedIn ? `Check out · ${elapsed}` : 'Check in';

  return (
    <button
      type="button"
      onClick={isClockedIn ? onCheckOut : onCheckIn}
      disabled={loading}
      aria-label={isClockedIn ? 'Check out' : 'Check in'}
      className="focus:outline-none focus-visible:shadow-[0_0_0_3px_var(--color-ring)]"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '9px',
        height: '40px',
        padding: '0 18px',
        borderRadius: '9px',
        border: '1px solid transparent',
        background: isClockedIn ? 'var(--color-danger)' : 'var(--color-primary)',
        color: isClockedIn ? 'var(--color-danger-fg)' : 'var(--color-primary-fg)',
        font: "600 14px 'Hanken Grotesk'",
        cursor: loading ? 'wait' : 'pointer',
        opacity: loading ? 0.7 : 1,
        transition: 'background .15s, filter .15s',
        boxShadow: 'var(--shadow-sm)',
      }}
      onMouseEnter={(e) => {
        if (!loading) e.currentTarget.style.filter = 'brightness(1.04)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.filter = '';
      }}
    >
      {isClockedIn ? (
        <span
          aria-hidden
          style={{
            width: '9px',
            height: '9px',
            borderRadius: '999px',
            background: 'currentColor',
            animation: 'ds-pulse 1.6s ease-in-out infinite',
            flexShrink: 0,
          }}
        />
      ) : (
        <LogIn size={16} strokeWidth={2.2} />
      )}
      {label}
    </button>
  );
}
