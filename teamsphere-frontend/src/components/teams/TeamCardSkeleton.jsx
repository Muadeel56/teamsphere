import { SkeletonBlock } from '../SkeletonCard';

export default function TeamCardSkeleton() {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[16px] p-5">
      <div className="flex items-center gap-3 mb-[18px]">
        <SkeletonBlock className="h-10 w-10 rounded-[11px]" />
        <div>
          <SkeletonBlock className="h-4 w-[120px] mb-2" />
          <SkeletonBlock className="h-[11px] w-[70px] rounded-[5px]" />
        </div>
      </div>
      <div className="flex mb-[18px]">
        {Array.from({ length: 5 }, (_, i) => (
          <SkeletonBlock
            key={i}
            className="h-10 w-10 rounded-full"
            style={{
              marginLeft: i === 0 ? 0 : '-12px',
              border: '2.5px solid var(--color-surface)',
            }}
          />
        ))}
      </div>
      <div className="h-px bg-[var(--color-border)] mb-3.5" />
      <SkeletonBlock className="h-[14px] w-24" />
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
