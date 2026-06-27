import { useEffect, useState } from 'react';

export default function VelocityChart({ bars }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '14px',
        padding: '20px',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        <div>
          <h3 style={{ font: "600 17px 'Newsreader'", margin: 0, color: 'var(--color-text)' }}>
            Velocity
          </h3>
          <p
            style={{
              font: "400 12.5px 'Hanken Grotesk'",
              color: 'var(--color-muted)',
              margin: '3px 0 0',
            }}
          >
            Tasks completed · last 7 days
          </p>
        </div>
        <span
          style={{
            font: "500 12px 'IBM Plex Mono'",
            color: 'var(--color-success)',
            background: 'var(--color-success-subtle)',
            padding: '4px 9px',
            borderRadius: '999px',
          }}
        >
          ▲ 14%
        </span>
      </div>

      {/* Bars */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '148px' }}>
        {bars.map((bar, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '9px',
              height: '100%',
              justifyContent: 'flex-end',
            }}
          >
            <div
              style={{
                width: '100%',
                borderRadius: '7px 7px 3px 3px',
                background: bar.peak ? 'var(--color-primary)' : 'var(--color-surface-3)',
                height: mounted ? bar.h : '0%',
                transition: 'height 0.4s cubic-bezier(.2,.8,.2,1)',
              }}
            />
            <span
              style={{
                font: "500 11px 'IBM Plex Mono'",
                color: 'var(--color-subtle)',
              }}
            >
              {bar.d}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
