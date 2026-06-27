import { Plus, CheckSquare } from 'lucide-react';
import Button from '../Button';

export default function TasksEmptyState({ onCreate, filtered = false }) {
  return (
    <div
      className="flex flex-col items-center text-center px-6 py-16 border-[1.5px] border-dashed border-[var(--color-border-strong)] rounded-[18px] bg-[var(--color-surface)]"
      style={{ animation: 'ds-rise .4s cubic-bezier(.2,.8,.2,1) both' }}
    >
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
      <h3 className="font-serif text-[24px] font-medium tracking-[-0.01em] text-[var(--color-text)] m-0 mb-2.5">
        {filtered ? 'Nothing matches this filter' : 'No tasks here'}
      </h3>
      <p className="text-[15px] leading-[1.6] text-[var(--color-muted)] m-0 mb-[26px] max-w-[42ch]">
        {filtered
          ? 'Create a task or switch the filter to see more.'
          : 'Create your first task and track work across every project.'}
      </p>
      <Button onClick={onCreate} icon={<Plus size={17} />}>
        New task
      </Button>
    </div>
  );
}
