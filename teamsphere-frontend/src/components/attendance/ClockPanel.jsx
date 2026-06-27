import { LogIn, LogOut } from 'lucide-react';
import Button from '../Button';

export default function ClockPanel({
  activeSession,
  elapsed,
  clockLoading,
  onCheckIn,
  onCheckOut,
}) {
  const isClockedIn = Boolean(activeSession);

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '14px',
        padding: '20px',
        boxShadow: 'var(--shadow-sm)',
        animation: 'ds-rise .4s cubic-bezier(.2,.8,.2,1) both',
      }}
    >
      <h3
        style={{
          font: "600 15px 'Newsreader'",
          margin: '0 0 6px',
          color: 'var(--color-text)',
        }}
      >
        Clock in / out
      </h3>
      <p
        style={{
          font: "400 13px 'Hanken Grotesk'",
          color: 'var(--color-muted)',
          margin: '0 0 20px',
        }}
      >
        {isClockedIn ? 'You are currently clocked in.' : 'Start your work session for today.'}
      </p>

      {isClockedIn ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            aria-live="polite"
            aria-label="Elapsed time"
            className="font-mono"
            style={{
              font: "500 32px/1 'IBM Plex Mono'",
              color: 'var(--color-text)',
              letterSpacing: '-0.02em',
            }}
          >
            {elapsed}
          </div>
          <Button
            variant="danger"
            onClick={onCheckOut}
            loading={clockLoading}
            icon={<LogOut size={16} />}
          >
            Clock out
          </Button>
        </div>
      ) : (
        <Button
          onClick={onCheckIn}
          loading={clockLoading}
          icon={<LogIn size={16} />}
        >
          Clock in
        </Button>
      )}
    </div>
  );
}
