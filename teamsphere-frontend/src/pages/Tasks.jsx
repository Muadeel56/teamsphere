import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { useAuthStore } from '../store/authStore';
import { getTasksPageData, updateTask } from '../services/tasks';
import {
  filterTasks,
  groupTasksByStatus,
  getDefaultFilters,
  loadViewMode,
  saveViewMode,
  resolveAssignee,
  STATUS_META,
} from '../lib/taskHelpers';

import Button from '../components/Button';
import TaskRow from '../components/tasks/TaskRow';
import KanbanBoard from '../components/tasks/KanbanBoard';
import NewTaskModal from '../components/tasks/NewTaskModal';
import TasksViewToggle from '../components/tasks/TasksViewToggle';
import TasksFilterBar from '../components/tasks/TasksFilterBar';
import TasksEmptyState from '../components/tasks/TasksEmptyState';
import TasksErrorState from '../components/tasks/TasksErrorState';
import TasksSkeleton from '../components/tasks/TasksSkeleton';

export default function Tasks() {
  const user = useAuthStore((s) => s.user);

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState(loadViewMode);
  const [filters, setFilters] = useState(getDefaultFilters);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await getTasksPageData(user);
      setTasks(data.tasks);
      setProjects(data.projects);
      setUserMap(data.userMap);
    } catch {
      setLoadError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    saveViewMode(mode);
  };

  const filteredTasks = useMemo(
    () => filterTasks(tasks, filters),
    [tasks, filters],
  );

  const groupedTasks = useMemo(
    () => groupTasksByStatus(filteredTasks),
    [filteredTasks],
  );

  const projectMap = useMemo(
    () => Object.fromEntries(projects.map((p) => [p.id, p])),
    [projects],
  );

  const assigneeOptions = useMemo(
    () => Object.values(userMap).sort((a, b) => a.id - b.id),
    [userMap],
  );

  const taskCountLabel = `${tasks.length} task${tasks.length === 1 ? '' : 's'}`;

  const handleToggleComplete = async (task) => {
    const previousStatus = task.status;
    const newStatus = previousStatus === 'done' ? 'todo' : 'done';

    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)),
    );

    try {
      await updateTask(task.id, { status: newStatus });
      toast.success(newStatus === 'done' ? 'Task completed' : 'Task reopened');
    } catch {
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: previousStatus } : t)),
      );
      toast.error("Couldn't update task");
    }
  };

  const handleTaskStatusChange = async (taskId, newStatus, previousStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
    );

    try {
      await updateTask(taskId, { status: newStatus });
      const label = STATUS_META[newStatus]?.label ?? newStatus;
      toast.success(`Moved to ${label}`);
    } catch {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: previousStatus } : t)),
      );
      toast.error("Couldn't update task");
    }
  };

  return (
    <div>
      {/* Page header */}
      <div className="flex items-end justify-between gap-4 flex-wrap mb-[22px]">
        <div>
          <div className="flex items-center gap-[11px]">
            <h2 className="font-serif text-[30px] font-medium leading-[1.15] tracking-[-0.01em] text-[var(--color-text)] m-0">
              Tasks
            </h2>
            {!loading && !loadError && (
              <span className="font-mono text-[13px] font-semibold text-[var(--color-muted)] bg-[var(--color-surface-2)] border border-[var(--color-border)] px-2.5 py-[3px] rounded-full">
                {taskCountLabel}
              </span>
            )}
          </div>
          <p className="text-[15px] text-[var(--color-muted)] mt-[7px] mb-0">
            Track work across every project, your way.
          </p>
        </div>

        <Button icon={<Plus size={16} />} onClick={() => setModalOpen(true)}>
          New task
        </Button>
      </div>

      {/* Toolbar: view toggle + filters — matches design ref layout */}
      {!loading && !loadError && tasks.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap mb-[22px]">
          <TasksViewToggle value={viewMode} onChange={handleViewModeChange} />
          <TasksFilterBar
            filters={filters}
            onChange={setFilters}
            projects={projects}
            userMap={userMap}
          />
        </div>
      )}

      {/* Content states */}
      {loading ? (
        <TasksSkeleton viewMode={viewMode} />
      ) : loadError ? (
        <TasksErrorState onRetry={fetchTasks} />
      ) : tasks.length === 0 ? (
        <TasksEmptyState onCreate={() => setModalOpen(true)} />
      ) : filteredTasks.length === 0 ? (
        <TasksEmptyState filtered onCreate={() => setModalOpen(true)} />
      ) : viewMode === 'list' ? (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[14px] shadow-[var(--shadow-sm)] overflow-hidden">
          {filteredTasks.map((task, index) => (
            <div
              key={task.id}
              style={{
                animation: 'ds-rise .4s cubic-bezier(.2,.8,.2,1) both',
                animationDelay: `${index * 0.03}s`,
              }}
            >
              <TaskRow
                task={task}
                project={projectMap[task.project]}
                assignee={resolveAssignee(task.assignee, userMap)}
                onToggleComplete={handleToggleComplete}
              />
            </div>
          ))}
        </div>
      ) : (
        <KanbanBoard
          groupedTasks={groupedTasks}
          projects={projects}
          userMap={userMap}
          onTaskStatusChange={handleTaskStatusChange}
        />
      )}

      <NewTaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={fetchTasks}
        projects={projects}
        assigneeOptions={assigneeOptions.length > 0 ? assigneeOptions : user ? [user] : []}
      />
    </div>
  );
}
