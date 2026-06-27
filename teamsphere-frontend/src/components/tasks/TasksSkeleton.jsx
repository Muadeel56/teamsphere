import { SkeletonBlock } from '../SkeletonCard';

function KanbanCardSkeleton() {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-3.5 mb-2.5">
      <SkeletonBlock className="h-[14px] w-[85%] mb-3" />
      <SkeletonBlock className="h-5 w-[60px] mb-3 rounded-[7px]" />
      <div className="flex justify-between">
        <SkeletonBlock className="h-5 w-14 rounded-[7px]" />
        <SkeletonBlock className="h-[26px] w-[26px] rounded-full" />
      </div>
    </div>
  );
}

function KanbanColumnSkeleton() {
  return (
    <div className="min-w-[284px] bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-[14px] p-3.5">
      <SkeletonBlock className="h-4 w-24 mb-4" />
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
            <SkeletonBlock className="h-[18px] w-[18px] rounded-full" />
            <SkeletonBlock className="h-[14px] flex-1" />
            <SkeletonBlock className="h-[21px] w-[72px] rounded-[7px]" />
            <SkeletonBlock className="h-6 w-14 rounded-full" />
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
