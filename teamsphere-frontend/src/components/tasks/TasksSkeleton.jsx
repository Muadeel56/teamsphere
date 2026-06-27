const shimmerStyle = {
  background: 'var(--skel)',
  backgroundSize: '300% 100%',
  animation: 'ds-shimmer 1.3s infinite linear',
  borderRadius: '8px',
};

function KanbanCardSkeleton() {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-3.5 mb-2.5">
      <div style={{ ...shimmerStyle, width: '85%', height: '14px', marginBottom: '12px' }} />
      <div style={{ ...shimmerStyle, width: '60px', height: '20px', marginBottom: '12px', borderRadius: '7px' }} />
      <div className="flex justify-between">
        <div style={{ ...shimmerStyle, width: '56px', height: '20px', borderRadius: '7px' }} />
        <div style={{ ...shimmerStyle, width: '26px', height: '26px', borderRadius: '999px' }} />
      </div>
    </div>
  );
}

function KanbanColumnSkeleton() {
  return (
    <div className="min-w-[284px] bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-[14px] p-3.5">
      <div style={{ ...shimmerStyle, width: '96px', height: '16px', marginBottom: '16px' }} />
      {Array.from({ length: 3 }, (_, i) => (
        <KanbanCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function TasksSkeleton({ viewMode = 'board' }) {
  if (viewMode === 'list') {
    return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[14px] overflow-hidden">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-border)] last:border-b-0"
          >
            <div style={{ ...shimmerStyle, width: '18px', height: '18px', borderRadius: '999px' }} />
            <div style={{ ...shimmerStyle, flex: 1, height: '14px' }} />
            <div style={{ ...shimmerStyle, width: '72px', height: '21px', borderRadius: '7px' }} />
            <div style={{ ...shimmerStyle, width: '56px', height: '24px', borderRadius: '999px' }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-x-auto">
      {Array.from({ length: 3 }, (_, i) => (
        <KanbanColumnSkeleton key={i} />
      ))}
    </div>
  );
}
