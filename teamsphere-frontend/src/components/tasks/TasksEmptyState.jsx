import { Plus, CheckSquare } from 'lucide-react';
import EmptyState from '../EmptyState';

export default function TasksEmptyState({ onCreate, filtered = false }) {
  if (filtered) {
    return (
      <EmptyState
        eyebrow="Tasks"
        title="Nothing matches this filter"
        description="Create a task or switch the filter to see more."
        actionLabel="New task"
        actionIcon={<Plus size={17} />}
        onAction={onCreate}
        icon={
          <div className="relative w-[120px] h-[88px] mb-[26px]">
            <div className="absolute left-[14px] top-4 w-20 h-[60px] rounded-[11px] bg-[var(--color-surface-2)] border border-[var(--color-border)] -rotate-[8deg]" />
            <div className="absolute right-[14px] top-2.5 w-20 h-[60px] rounded-[11px] bg-[var(--color-surface-2)] border border-[var(--color-border)] rotate-[7deg]" />
            <div
              className="absolute left-1/2 top-3.5 -translate-x-1/2 w-[84px] h-16 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-strong)] shadow-[var(--shadow-md)] grid place-items-center text-[var(--color-primary)]"
              style={{ animation: 'ds-floaty 3s ease-in-out infinite alternate' }}
            >
              <CheckSquare size={30} strokeWidth={1.7} />
            </div>
          </div>
        }
      />
    );
  }

  return (
    <EmptyState
      eyebrow="Tasks"
      title="No tasks here"
      description="Create your first task and track work across every project."
      actionLabel="New task"
      actionIcon={<Plus size={17} />}
      onAction={onCreate}
      icon={
        <div className="relative w-[120px] h-[88px] mb-[26px]">
          <div className="absolute left-[14px] top-4 w-20 h-[60px] rounded-[11px] bg-[var(--color-surface-2)] border border-[var(--color-border)] -rotate-[8deg]" />
          <div className="absolute right-[14px] top-2.5 w-20 h-[60px] rounded-[11px] bg-[var(--color-surface-2)] border border-[var(--color-border)] rotate-[7deg]" />
          <div
            className="absolute left-1/2 top-3.5 -translate-x-1/2 w-[84px] h-16 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-strong)] shadow-[var(--shadow-md)] grid place-items-center text-[var(--color-primary)]"
            style={{ animation: 'ds-floaty 3s ease-in-out infinite alternate' }}
          >
            <CheckSquare size={30} strokeWidth={1.7} />
          </div>
        </div>
      }
    />
  );
}
