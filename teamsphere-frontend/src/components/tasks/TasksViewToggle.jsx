import { List, Columns3 } from 'lucide-react';

const OPTIONS = [
  { id: 'board', label: 'Board', icon: Columns3 },
  { id: 'list', label: 'List', icon: List },
];

export default function TasksViewToggle({ value, onChange }) {
  return (
    <div className="inline-flex gap-0.5 p-[3px] rounded-[9px] border border-[var(--color-border)] bg-[var(--color-surface)] shrink-0">
      {OPTIONS.map((opt) => {
        const isActive = value === opt.id;
        const Icon = opt.icon;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className="inline-flex items-center gap-[7px] h-8 px-3 rounded-[7px] border-none cursor-pointer text-[13px] font-semibold transition-[background,color] duration-150"
            style={{
              background: isActive ? 'var(--color-primary-subtle)' : 'transparent',
              color: isActive ? 'var(--color-primary)' : 'var(--color-muted)',
            }}
          >
            <Icon size={15} />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
