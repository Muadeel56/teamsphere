import { getUserDisplayName, getUserInitials } from './userInitials';
import { resolveUser } from './projectHelpers';

const PROJECT_COLORS = [
  'oklch(0.495 0.090 183)',
  'oklch(0.56 0.105 262)',
  'oklch(0.55 0.11 150)',
  'oklch(0.555 0.16 25)',
  'oklch(0.70 0.12 75)',
];

export const STATUS_META = {
  todo: { label: 'To Do', dot: 'var(--color-muted)', badgeVariant: 'todo' },
  in_progress: {
    label: 'In Progress',
    dot: 'var(--color-info)',
    badgeVariant: 'in-progress',
  },
  done: { label: 'Done', dot: 'var(--color-success)', badgeVariant: 'done' },
};

export const PRIORITY_META = {
  high: { label: 'High', variant: 'high', dot: 'var(--color-danger)' },
  medium: { label: 'Medium', variant: 'medium', dot: 'var(--color-warning)' },
  low: { label: 'Low', variant: 'low', dot: 'var(--color-muted)' },
};

export const BOARD_COLUMNS = [
  { status: 'todo', label: 'To Do', dotColor: 'var(--color-muted)' },
  { status: 'in_progress', label: 'In Progress', dotColor: 'var(--color-info)' },
  { status: 'done', label: 'Done', dotColor: 'var(--color-success)' },
];

export function getProjectName(projectId, projects) {
  return projects.find((p) => p.id === projectId)?.name ?? 'Unknown project';
}

export function getProjectColor(projectId) {
  if (!projectId) return PROJECT_COLORS[0];
  let hash = 0;
  const str = String(projectId);
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PROJECT_COLORS[Math.abs(hash) % PROJECT_COLORS.length];
}

export function resolveAssignee(assigneeId, userMap) {
  const user = resolveUser(assigneeId, userMap);
  if (!user) return null;
  return {
    user,
    initials: getUserInitials(user),
    displayName: getUserDisplayName(user),
  };
}

export function isTaskOverdue(task) {
  if (!task.due_date || task.status === 'done') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(task.due_date.slice(0, 10));
  return due < today;
}

export function formatTaskDueDate(iso) {
  if (!iso) return null;
  const date = new Date(iso.slice(0, 10));
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function filterTasks(tasks, filters) {
  return tasks.filter((task) => {
    if (filters.status !== 'all' && task.status !== filters.status) return false;
    if (filters.assignee !== 'all') {
      const assigneeId = filters.assignee === 'unassigned' ? null : Number(filters.assignee);
      if (task.assignee !== assigneeId) return false;
    }
    if (filters.priority !== 'all' && (task.priority ?? 'medium') !== filters.priority) {
      return false;
    }
    if (filters.project !== 'all' && task.project !== Number(filters.project)) return false;
    return true;
  });
}

export function groupTasksByStatus(tasks) {
  return {
    todo: tasks.filter((t) => t.status === 'todo'),
    in_progress: tasks.filter((t) => t.status === 'in_progress'),
    done: tasks.filter((t) => t.status === 'done'),
  };
}

export function getDefaultFilters() {
  return {
    status: 'all',
    assignee: 'all',
    priority: 'all',
    project: 'all',
  };
}

export const VIEW_MODE_STORAGE_KEY = 'teamsphere.tasks.viewMode';

export function loadViewMode() {
  try {
    const stored = localStorage.getItem(VIEW_MODE_STORAGE_KEY);
    if (stored === 'list' || stored === 'board') return stored;
  } catch {
    // ignore
  }
  return 'board';
}

export function saveViewMode(mode) {
  try {
    localStorage.setItem(VIEW_MODE_STORAGE_KEY, mode);
  } catch {
    // ignore
  }
}
