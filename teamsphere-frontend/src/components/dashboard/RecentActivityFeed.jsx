export default function RecentActivityFeed({ items }) {
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
      <h3 style={{ font: "600 17px 'Newsreader'", margin: '0 0 16px', color: 'var(--color-text)' }}>
        Recent activity
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '11px',
              padding: '9px 0',
            }}
          >
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '999px',
                background: item.color,
                color: '#fff',
                display: 'grid',
                placeItems: 'center',
                font: "600 11px 'Hanken Grotesk'",
                flexShrink: 0,
              }}
            >
              {item.initials}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ font: "400 13px/1.45 'Hanken Grotesk'", color: 'var(--color-text)' }}>
                {item.text}
              </div>
              <div
                style={{
                  font: "400 11px 'IBM Plex Mono'",
                  color: 'var(--color-subtle)',
                  marginTop: '2px',
                }}
              >
                {item.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
