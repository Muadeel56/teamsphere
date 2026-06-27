import { getUserDisplayName } from '../../lib/userInitials';

const STATUS_TABS = [
  { id: 'all', label: 'All' },
  { id: 'todo', label: 'To Do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
];

const selectClasses =
  'h-8 px-2.5 rounded-[7px] border border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-text)] text-[12.5px] font-medium cursor-pointer focus:outline-none focus:border-[var(--color-primary)] focus:shadow-[0_0_0_3px_var(--color-ring)]';

export default function TasksFilterBar({ filters, onChange, projects, userMap }) {
  const assigneeOptions = Object.values(userMap).sort((a, b) => a.id - b.id);

  const set = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Status — pill group per design ref */}
      <div className="inline-flex gap-0.5 p-[3px] rounded-[9px] border border-[var(--color-border)] bg-[var(--color-surface)] shrink-0">
        {STATUS_TABS.map((tab) => {
          const isActive = filters.status === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => set('status', tab.id)}
              className="h-8 px-[11px] rounded-[7px] border-none cursor-pointer text-[12.5px] font-semibold transition-[background,color] duration-150 whitespace-nowrap"
              style={{
                background: isActive ? 'var(--color-primary-subtle)' : 'transparent',
                color: isActive ? 'var(--color-primary)' : 'var(--color-muted)',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <FilterSelect
        label="Assignee"
        value={filters.assignee}
        onChange={(v) => set('assignee', v)}
        options={[
          { value: 'all', label: 'All assignees' },
          { value: 'unassigned', label: 'Unassigned' },
          ...assigneeOptions.map((u) => ({
            value: String(u.id),
            label: getUserDisplayName(u),
          })),
        ]}
      />
      <FilterSelect
        label="Priority"
        value={filters.priority}
        onChange={(v) => set('priority', v)}
        options={[
          { value: 'all', label: 'All priorities' },
          { value: 'high', label: 'High' },
          { value: 'medium', label: 'Medium' },
          { value: 'low', label: 'Low' },
        ]}
      />
      <FilterSelect
        label="Project"
        value={filters.project}
        onChange={(v) => set('project', v)}
        options={[
          { value: 'all', label: 'All projects' },
          ...projects.map((p) => ({ value: String(p.id), label: p.name })),
        ]}
      />
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  const id = `filter-${label.toLowerCase()}`;
  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor={id}
        className="font-mono text-[11px] font-semibold uppercase tracking-[0.04em] text-[var(--color-subtle)]"
      >
        {label}
      </label>
      <select
        id={id}
        className={selectClasses}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
