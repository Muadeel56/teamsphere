import { Plus, Users } from 'lucide-react';
import EmptyState from '../EmptyState';

export default function TeamsEmptyState({ onCreate }) {
  return (
    <EmptyState
      eyebrow="Teams"
      title="No teams yet"
      description="Create a team, add members, and start organizing your projects around the people who run them."
      actionLabel="Create your first team"
      actionIcon={<Plus size={17} />}
      onAction={onCreate}
      icon={
        <div
          className="w-[84px] h-[84px] rounded-[22px] bg-[var(--color-surface-2)] border border-[var(--color-border)] grid place-items-center mb-6 text-[var(--color-primary)]"
          style={{ animation: 'ds-floaty 3s ease-in-out infinite alternate' }}
        >
          <Users size={38} strokeWidth={1.6} />
        </div>
      }
    />
  );
}
