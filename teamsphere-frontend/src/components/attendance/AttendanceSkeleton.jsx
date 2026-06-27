const shimmerStyle = {
  background: 'var(--skel)',
  backgroundSize: '300% 100%',
  animation: 'ds-shimmer 1.3s infinite linear',
  borderRadius: '8px',
};

function KpiSkeletonCard() {
  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '14px',
        padding: '18px',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ ...shimmerStyle, width: '80px', height: '13px' }} />
        <div style={{ ...shimmerStyle, width: '30px', height: '30px', borderRadius: '8px' }} />
      </div>
      <div style={{ ...shimmerStyle, width: '64px', height: '32px', margin: '14px 0 8px' }} />
      <div style={{ ...shimmerStyle, width: '100px', height: '12px' }} />
    </div>
  );
}

function TableRowSkeleton() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '14px 18px',
        borderTop: '1px solid var(--color-border)',
      }}
    >
      <div style={{ ...shimmerStyle, width: '28px', height: '28px', borderRadius: '999px' }} />
      <div style={{ ...shimmerStyle, width: '120px', height: '14px' }} />
      <div style={{ flex: 1 }} />
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} style={{ ...shimmerStyle, width: '8px', height: '8px', borderRadius: '999px' }} />
      ))}
      <div style={{ ...shimmerStyle, width: '72px', height: '14px' }} />
    </div>
  );
}

export function AttendanceKpiSkeleton() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(216px, 1fr))',
        gap: '16px',
        marginTop: '24px',
      }}
    >
      {[0, 1, 2, 3].map((i) => (
        <KpiSkeletonCard key={i} />
      ))}
    </div>
  );
}

export default function AttendanceSkeleton() {
  return (
    <div>
      <div
        style={{
          marginTop: '16px',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '14px',
          overflow: 'hidden',
        }}
      >
        <div style={{ ...shimmerStyle, height: '40px', margin: '12px 18px', borderRadius: '6px' }} />
        {[0, 1, 2, 3, 4].map((i) => (
          <TableRowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
