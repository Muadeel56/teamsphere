export default function DashboardKpiCard({
  label,
  value,
  glyph,
  tintBg,
  tintFg,
  delta,
  deltaNote,
  deltaColor,
  animationDelay = '0s',
}) {
  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '14px',
        padding: '18px',
        boxShadow: 'var(--shadow-sm)',
        animation: `ds-rise .4s cubic-bezier(.2,.8,.2,1) both`,
        animationDelay,
      }}
    >
      {/* Label + glyph badge row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ font: "500 12.5px 'Hanken Grotesk'", color: 'var(--color-muted)' }}>
          {label}
        </span>
        <span
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '8px',
            background: tintBg,
            color: tintFg,
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
            font: "700 13px 'Hanken Grotesk'",
          }}
        >
          {glyph}
        </span>
      </div>

      {/* Value */}
      <div
        style={{
          font: "500 32px/1 'Newsreader'",
          margin: '14px 0 8px',
          letterSpacing: '-0.01em',
          color: 'var(--color-text)',
        }}
      >
        {value}
      </div>

      {/* Delta row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          font: "500 12px 'Hanken Grotesk'",
          color: deltaColor,
        }}
      >
        {delta}{' '}
        <span style={{ color: 'var(--color-subtle)', fontWeight: 400 }}>{deltaNote}</span>
      </div>
    </div>
  );
}
