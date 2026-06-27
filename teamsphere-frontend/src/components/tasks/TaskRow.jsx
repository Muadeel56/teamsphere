import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import Badge from '../Badge';
import Avatar from '../Avatar';
import {
  PRIORITY_META,
  formatTaskDueDate,
  isTaskOverdue,
  getProjectColor,
} from '../../lib/taskHelpers';

export default function TaskRow({ task, project, assignee, onToggleComplete }) {
  const isDone = task.status === 'done';
  const priority = task.priority ?? 'medium';
  const priorityMeta = PRIORITY_META[priority] ?? PRIORITY_META.medium;
  const projectName = project?.name ?? 'Unknown project';
  const projectColor = getProjectColor(task.project);
  const dueFormatted = formatTaskDueDate(task.due_date);
  const overdue = isTaskOverdue(task);

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 border-b border-[var(--color-border)] last:border-b-0 transition-colors duration-150',
        'hover:bg-[var(--color-surface-2)]',
      )}
    >
      <button
        type="button"
        onClick={() => onToggleComplete(task)}
        aria-label={isDone ? 'Mark incomplete' : 'Mark complete'}
        className={cn(
          'w-[18px] h-[18px] rounded-full border-2 shrink-0 grid place-items-center cursor-pointer transition-[background,border-color] duration-150',
          isDone
            ? 'bg-[var(--color-success)] border-[var(--color-success)] text-white'
            : 'border-[var(--color-border-strong)] bg-transparent hover:border-[var(--color-primary)]',
        )}
      >
        {isDone && <Check size={11} strokeWidth={3} />}
      </button>

      <div
        className={cn(
          'flex-1 min-w-0 text-[13.5px] font-semibold truncate',
          isDone ? 'line-through text-[var(--color-muted)]' : 'text-[var(--color-text)]',
        )}
      >
        {task.title}
      </div>

      <span className="hidden sm:inline-flex items-center gap-1.5 h-[21px] px-2 rounded-[7px] bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[11px] font-semibold text-[var(--color-muted)] shrink-0">
        <span
          className="w-1.5 h-1.5 rounded-[2px] shrink-0"
          style={{ background: projectColor }}
        />
        <span className="truncate max-w-[120px]">{projectName}</span>
      </span>

      <Badge
        variant={priorityMeta.variant}
        label={priorityMeta.label}
        className="hidden md:inline-flex shrink-0"
      />

      {assignee ? (
        <Avatar initials={assignee.initials} size="sm" className="hidden lg:inline-flex shrink-0" />
      ) : (
        <div
          className="hidden lg:grid w-7 h-7 rounded-full border-[1.5px] border-dashed border-[var(--color-border-strong)] shrink-0"
          title="Unassigned"
        />
      )}

      {dueFormatted ? (
        <span
          className="font-mono text-[12px] font-semibold shrink-0 hidden sm:inline"
          style={{ color: overdue ? 'var(--color-danger)' : 'var(--color-muted)' }}
        >
          {dueFormatted}
        </span>
      ) : (
        <span className="font-mono text-[12px] text-[var(--color-subtle)] shrink-0 hidden sm:inline">
          —
        </span>
      )}
    </div>
  );
}
