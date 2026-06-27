import { SkeletonBlock, SkeletonCard } from '../SkeletonCard';

function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-3.5 px-[18px] py-3.5 border-t border-[var(--color-border)]">
      <SkeletonBlock className="h-[30px] w-[30px] rounded-full shrink-0" />
      <SkeletonBlock className="h-[13px] w-[130px]" />
      <SkeletonBlock className="h-[13px] w-14 ml-auto" />
      <SkeletonBlock className="h-[13px] w-14" />
      <SkeletonBlock className="h-[22px] w-[70px] rounded-full" />
    </div>
  );
}

export function AttendanceKpiSkeleton() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(166px,1fr))] gap-3.5 mb-[22px]">
      {[0, 1, 2, 3].map((i) => (
        <SkeletonCard key={i} className="flex items-center gap-[13px] p-4">
          <SkeletonBlock className="h-[38px] w-[38px] rounded-[10px] shrink-0" />
          <div className="flex-1">
            <SkeletonBlock className="h-8 w-16 mb-2" />
            <SkeletonBlock className="h-3 w-24" />
          </div>
        </SkeletonCard>
      ))}
    </div>
  );
}

export default function AttendanceSkeleton() {
  return (
    <div>
      <div className="mt-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[14px] overflow-hidden">
        <SkeletonBlock className="h-10 mx-[18px] my-3 rounded-md" />
        {[0, 1, 2, 3, 4].map((i) => (
          <TableRowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
