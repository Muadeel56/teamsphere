import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import KanbanCardView from './KanbanCardView';

export default function KanbanCard({ task, project, assignee }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  return (
    <KanbanCardView
      ref={setNodeRef}
      style={style}
      task={task}
      project={project}
      assignee={assignee}
      isDragging={isDragging}
      dragHandleProps={{ ...listeners, ...attributes }}
    />
  );
}
