const shimmerStyle = {
  background: 'var(--skel)',
  backgroundSize: '300% 100%',
  animation: 'ds-shimmer 1.3s infinite linear',
  borderRadius: '8px',
};

export default function TeamCardSkeleton() {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[16px] p-5">
      <div className="flex items-center gap-3 mb-[18px]">
        <div style={{ ...shimmerStyle, width: '40px', height: '40px', borderRadius: '11px' }} />
        <div>
          <div style={{ ...shimmerStyle, width: '120px', height: '16px', marginBottom: '8px' }} />
          <div style={{ ...shimmerStyle, width: '70px', height: '11px', borderRadius: '5px' }} />
        </div>
      </div>
      <div className="flex mb-[18px]">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            style={{
              ...shimmerStyle,
              width: '40px',
              height: '40px',
              borderRadius: '999px',
              marginLeft: i === 0 ? 0 : '-12px',
              border: '2.5px solid var(--color-surface)',
            }}
          />
        ))}
      </div>
      <div className="h-px bg-[var(--color-border)] mb-3.5" />
      <div style={{ ...shimmerStyle, width: '96px', height: '14px' }} />
    </div>
  );
}

export function TeamsSkeletonGrid() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[18px]">
      {Array.from({ length: 6 }, (_, i) => (
        <TeamCardSkeleton key={i} />
      ))}
    </div>
  );
}
