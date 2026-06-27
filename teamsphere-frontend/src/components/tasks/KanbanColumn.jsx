import { useDroppable } from '@dnd-kit/core';
import { cn } from '../../lib/utils';
import KanbanCard from './KanbanCard';
import { resolveAssignee } from '../../lib/taskHelpers';

export default function KanbanColumn({
  status,
  label,
  dotColor,
  tasks,
  projectMap,
  userMap,
  activeTaskId,
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  const showDropHint = isOver && activeTaskId != null;

  return (
    <div className="flex flex-col max-h-[608px] min-w-[284px] bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-[14px]">
      <div className="flex items-center justify-between gap-2 px-[15px] pt-3.5 pb-3 shrink-0">
        <span className="inline-flex items-center gap-2 text-[13.5px] font-semibold text-[var(--color-text)]">
          <span
            className="w-2 h-2 rounded-[3px] shrink-0"
            style={{ background: dotColor }}
          />
          {label}
        </span>
        <span className="font-mono text-[12px] font-semibold text-[var(--color-muted)] bg-[var(--color-surface)] border border-[var(--color-border)] px-2 py-px rounded-full">
          {tasks.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 overflow-y-auto px-3 pb-3.5 flex flex-col gap-2.5 min-h-[120px] transition-[background,box-shadow] duration-150 rounded-b-[14px]',
          showDropHint &&
            'bg-[var(--color-primary-subtle)] ring-2 ring-inset ring-[var(--color-primary)]',
        )}
      >
        {tasks.length === 0 ? (
          <div
            className={cn(
              'text-center py-[22px] px-2 text-[12.5px] text-[var(--color-subtle)] border-[1.5px] border-dashed rounded-[11px] flex-1 grid place-items-center',
              showDropHint
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-[var(--color-border)]',
            )}
          >
            {showDropHint ? 'Drop here' : 'Nothing here'}
          </div>
        ) : (
          tasks.map((task, index) => (
            <div
              key={task.id}
              style={{
                animation: activeTaskId === task.id ? 'none' : 'ds-rise .4s cubic-bezier(.2,.8,.2,1) both',
                animationDelay: activeTaskId === task.id ? undefined : `${index * 0.04}s`,
              }}
            >
              <KanbanCard
                task={task}
                project={projectMap[task.project]}
                assignee={resolveAssignee(task.assignee, userMap)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
