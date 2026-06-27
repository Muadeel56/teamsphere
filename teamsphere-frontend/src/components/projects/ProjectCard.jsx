import Card from '../Card';
import Badge from '../Badge';
import Avatar, { AvatarGroup } from '../Avatar';
import { getUserInitials } from '../../lib/userInitials';
import { formatDueDate } from '../../lib/projectHelpers';

export default function ProjectCard({ project, animationDelay = '0s' }) {
  const dueLabel = formatDueDate(project.dueDate);

  return (
    <Card
      className="p-5 rounded-[15px] transition-[transform,box-shadow,border-color] duration-[180ms] ease-out hover:-translate-y-[3px] hover:shadow-[var(--shadow-md)] hover:border-[var(--color-primary)]"
      style={{
        animation: 'ds-rise .45s cubic-bezier(.2,.8,.2,1) both',
        animationDelay,
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-muted)]">
            Project
          </div>
          <h3 className="font-serif text-[20px] font-semibold leading-tight text-[var(--color-text)] mt-1.5">
            {project.name}
          </h3>
        </div>
        <Badge variant={project.badgeVariant} label={project.badgeLabel} />
      </div>

      <p className="text-[13.5px] leading-[1.55] text-[var(--color-muted)] line-clamp-2 mb-4 min-h-[42px]">
        {project.description || 'No description yet.'}
      </p>

      <div className="flex items-center justify-between font-mono text-[12px] font-medium text-[var(--color-muted)] mb-2">
        <span>Progress</span>
        <span className="text-[var(--color-text)]">{project.progress}%</span>
      </div>
      <div className="h-[7px] rounded-full bg-[var(--color-surface-2)] overflow-hidden">
        <div
          className="h-full rounded-full bg-[var(--color-primary)] transition-[width] duration-300"
          style={{ width: `${project.progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between mt-[18px] pt-4 border-t border-[var(--color-border)]">
        <AvatarGroup>
          {project.assignees.slice(0, 3).map((user) => (
            <Avatar key={user.id} initials={getUserInitials(user)} size="sm" />
          ))}
          {project.assignees.length > 3 && (
            <Avatar initials={`+${project.assignees.length - 3}`} size="sm" />
          )}
        </AvatarGroup>
        {dueLabel && (
          <span className="font-mono text-[12px] font-medium text-[var(--color-muted)]">
            {dueLabel}
          </span>
        )}
      </div>
    </Card>
  );
}
