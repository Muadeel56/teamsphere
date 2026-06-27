import { forwardRef } from 'react';
import { Calendar, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import Avatar from '../Avatar';
import {
  PRIORITY_META,
  formatTaskDueDate,
  isTaskOverdue,
  getProjectColor,
} from '../../lib/taskHelpers';

function DragHandle() {
  return (
    <span
      className="absolute left-[9px] top-[15px] flex flex-col gap-0.5 pointer-events-none"
      aria-hidden="true"
    >
      {[0, 1, 2].map((row) => (
        <span key={row} className="flex gap-0.5">
          <span className="w-[2.5px] h-[2.5px] rounded-full bg-[var(--color-border-strong)]" />
          <span className="w-[2.5px] h-[2.5px] rounded-full bg-[var(--color-border-strong)]" />
        </span>
      ))}
    </span>
  );
}

const KanbanCardView = forwardRef(function KanbanCardView(
  {
    task,
    project,
    assignee,
    isDragging = false,
    isOverlay = false,
    dragHandleProps = {},
    style,
    className,
  },
  ref,
) {
  const priority = task.priority ?? 'medium';
  const priorityMeta = PRIORITY_META[priority] ?? PRIORITY_META.medium;
  const projectName = project?.name ?? 'Unknown project';
  const projectColor = getProjectColor(task.project);
  const dueFormatted = formatTaskDueDate(task.due_date);
  const overdue = isTaskOverdue(task);

  return (
    <div
      ref={ref}
      style={style}
      {...dragHandleProps}
      className={cn(
        'relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl py-[13px] pr-[13px] pl-6 shadow-[var(--shadow-sm)] touch-none select-none',
        'transition-[transform,box-shadow,border-color,opacity] duration-150',
        !isOverlay &&
          !isDragging &&
          'cursor-grab hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] hover:border-[var(--color-border-strong)]',
        isDragging && !isOverlay && 'opacity-40 cursor-grabbing',
        isOverlay &&
          'cursor-grabbing rotate-[1.5deg] shadow-[var(--shadow-lg)] border-[var(--color-border-strong)] scale-[1.02]',
        className,
      )}
    >
      <DragHandle />

      <span
        className="absolute right-2.5 top-2.5 w-2 h-2 rounded-[2px] pointer-events-none"
        style={{ background: priorityMeta.dot }}
        title={`${priorityMeta.label} priority`}
      />

      <div className="text-[14px] font-semibold leading-[1.35] text-[var(--color-text)] mb-2.5 pr-4 pointer-events-none">
        {task.title}
      </div>

      <span className="inline-flex items-center gap-1.5 h-[21px] px-[9px] rounded-[7px] bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[11px] font-semibold text-[var(--color-muted)] mb-3 pointer-events-none">
        <span
          className="w-1.5 h-1.5 rounded-[2px] shrink-0"
          style={{ background: projectColor }}
        />
        {projectName}
      </span>

      <div className="flex items-center justify-between gap-2 pointer-events-none">
        {dueFormatted ? (
          <span
            className="inline-flex items-center gap-[5px] h-[22px] px-2 rounded-[7px] font-mono text-[11px] font-semibold"
            style={{
              background: overdue ? 'var(--color-danger-subtle)' : 'var(--color-surface-2)',
              color: overdue ? 'var(--color-danger)' : 'var(--color-muted)',
            }}
          >
            <Calendar size={11} />
            {dueFormatted}
          </span>
        ) : (
          <span className="font-mono text-[11px] text-[var(--color-subtle)]">No due date</span>
        )}

        {assignee ? (
          <div title={assignee.displayName}>
            <Avatar initials={assignee.initials} size="sm" />
          </div>
        ) : (
          <div
            className="w-[26px] h-[26px] rounded-full border-[1.5px] border-dashed border-[var(--color-border-strong)] grid place-items-center shrink-0"
            title="Unassigned"
          >
            <User size={13} className="text-[var(--color-subtle)]" />
          </div>
        )}
      </div>
    </div>
  );
});

export default KanbanCardView;
