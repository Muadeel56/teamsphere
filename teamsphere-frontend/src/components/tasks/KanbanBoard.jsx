import { useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';

import { useBreakpoint } from '../../hooks/useBreakpoint';
import { BOARD_COLUMNS, resolveAssignee } from '../../lib/taskHelpers';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import KanbanCardView from './KanbanCardView';

export default function KanbanBoard({
  groupedTasks,
  projects,
  userMap,
  onTaskStatusChange,
}) {
  const { isMobile, isTablet } = useBreakpoint();
  const [activeTaskId, setActiveTaskId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const projectMap = useMemo(
    () => Object.fromEntries(projects.map((p) => [p.id, p])),
    [projects],
  );

  const taskById = useMemo(() => {
    const map = new Map();
    for (const col of BOARD_COLUMNS) {
      for (const task of groupedTasks[col.status] ?? []) {
        map.set(task.id, task);
      }
    }
    return map;
  }, [groupedTasks]);

  const activeTask = activeTaskId != null ? taskById.get(activeTaskId) : null;

  const handleDragStart = ({ active }) => {
    setActiveTaskId(Number(active.id));
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveTaskId(null);
    if (!over) return;

    const taskId = Number(active.id);
    const newStatus = String(over.id);
    const task = taskById.get(taskId);
    if (!task || task.status === newStatus) return;

    const isValidColumn = BOARD_COLUMNS.some((c) => c.status === newStatus);
    if (isValidColumn) {
      onTaskStatusChange(taskId, newStatus, task.status);
    }
  };

  const handleDragCancel = () => {
    setActiveTaskId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div
        className={
          isMobile || isTablet
            ? 'flex gap-4 overflow-x-auto pb-2 -mx-1 px-1'
            : 'grid grid-cols-3 gap-4'
        }
      >
        {BOARD_COLUMNS.map((col) => (
          <KanbanColumn
            key={col.status}
            status={col.status}
            label={col.label}
            dotColor={col.dotColor}
            tasks={groupedTasks[col.status] ?? []}
            projectMap={projectMap}
            userMap={userMap}
            activeTaskId={activeTaskId}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(.2,.8,.2,1)' }}>
        {activeTask ? (
          <KanbanCardView
            task={activeTask}
            project={projectMap[activeTask.project]}
            assignee={resolveAssignee(activeTask.assignee, userMap)}
            isOverlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
