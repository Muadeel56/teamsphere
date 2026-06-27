import { Plus, Users } from 'lucide-react';
import Button from '../Button';

export default function TeamsEmptyState({ onCreate }) {
  return (
    <div
      className="flex flex-col items-center text-center px-6 py-16 border-[1.5px] border-dashed border-[var(--color-border-strong)] rounded-[18px] bg-[var(--color-surface)]"
      style={{ animation: 'ds-rise .4s cubic-bezier(.2,.8,.2,1) both' }}
    >
      <div
        className="w-[84px] h-[84px] rounded-[22px] bg-[var(--color-surface-2)] border border-[var(--color-border)] grid place-items-center mb-6 text-[var(--color-primary)]"
        style={{ animation: 'ds-floaty 3s ease-in-out infinite alternate' }}
      >
        <Users size={38} strokeWidth={1.6} />
      </div>
      <h3 className="font-serif text-[24px] font-medium tracking-[-0.01em] text-[var(--color-text)] m-0 mb-2.5">
        No teams yet
      </h3>
      <p className="text-[15px] leading-[1.6] text-[var(--color-muted)] m-0 mb-[26px] max-w-[42ch]">
        Create a team, add members, and start organizing your projects around the people who run them.
      </p>
      <Button onClick={onCreate} icon={<Plus size={17} />}>
        Create your first team
      </Button>
    </div>
  );
}
