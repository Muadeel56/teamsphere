import Avatar from '../Avatar';
import { useBreakpoint } from '../../hooks/useBreakpoint';

function StatusBadge({ label, fg, bg }) {
  return (
    <span
      className="inline-flex h-[23px] items-center gap-1.5 rounded-full px-2.5 text-[11.5px] font-semibold whitespace-nowrap"
      style={{ background: bg, color: fg }}
    >
      <span className="h-[5px] w-[5px] rounded-full" style={{ background: fg }} />
      {label}
    </span>
  );
}

function DesktopTable({ groups }) {
  return (
    <div
      className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[14px] shadow-[var(--shadow-sm)] overflow-hidden overflow-x-auto"
      style={{ animation: 'ds-rise .4s cubic-bezier(.2,.8,.2,1) both' }}
    >
      {groups.map((group) => (
        <div key={group.date}>
          <div className="flex items-center justify-between gap-2.5 px-[18px] py-3 bg-[var(--color-surface-2)] border-b border-[var(--color-border)] sticky top-0">
            <span className="font-mono text-[12.5px] font-semibold tracking-[0.04em] text-[var(--color-text)]">
              {group.label}
            </span>
            <span className="text-[11.5px] font-medium text-[var(--color-muted)]">{group.summary}</span>
          </div>
          <table className="w-full min-w-[480px] border-collapse">
            <thead>
              <tr>
                {['Member', 'In', 'Out', 'Duration', 'Status'].map((col, i) => (
                  <th
                    key={col}
                    className={`py-2.5 px-3 font-mono text-[11px] font-semibold uppercase tracking-[0.05em] text-[var(--color-subtle)] border-b border-[var(--color-border)] ${
                      i === 0 ? 'text-left pl-[18px]' : i === 4 ? 'text-right pr-[18px]' : 'text-left'
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {group.rows.map((row) => (
                <tr
                  key={`${group.date}-${row.userId}`}
                  className="border-t border-[var(--color-border)] transition-colors hover:bg-[var(--color-surface-2)]"
                  style={{ background: row.rowBg }}
                >
                  <td className="py-3 pl-[18px] pr-3">
                    <span className="inline-flex items-center gap-2.5 whitespace-nowrap">
                      <Avatar initials={row.initials} size="sm" />
                      <span className="text-[13.5px] font-semibold text-[var(--color-text)]">
                        {row.name}
                      </span>
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[13px] font-medium text-[var(--color-text)] whitespace-nowrap">
                    {row.checkIn}
                  </td>
                  <td
                    className="py-3 px-3 font-mono text-[13px] font-medium whitespace-nowrap"
                    style={{ color: row.outColor }}
                  >
                    {row.checkOut}
                  </td>
                  <td className="py-3 px-3 font-mono text-[13px] font-medium text-[var(--color-muted)] whitespace-nowrap">
                    {row.duration}
                  </td>
                  <td className="py-3 pr-[18px] pl-3 text-right">
                    <StatusBadge label={row.statusLabel} fg={row.statusFg} bg={row.statusBg} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

function MobileCards({ groups }) {
  return (
    <div className="flex flex-col gap-[18px]">
      {groups.map((group) => (
        <div key={group.date}>
          <div className="flex items-center justify-between mx-0.5 mb-2.5">
            <span className="font-mono text-[12.5px] font-semibold text-[var(--color-text)]">
              {group.label}
            </span>
            <span className="text-[11.5px] font-medium text-[var(--color-muted)]">{group.summary}</span>
          </div>
          <div className="flex flex-col gap-2.5">
            {group.rows.map((row) => (
              <div
                key={`${group.date}-${row.userId}`}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[13px] p-[15px] shadow-[var(--shadow-sm)]"
                style={{ borderLeft: `3px solid ${row.statusFg}` }}
              >
                <div className="flex items-center justify-between gap-2.5 mb-[13px]">
                  <span className="inline-flex items-center gap-2.5 min-w-0">
                    <Avatar initials={row.initials} size="sm" />
                    <span className="text-sm font-semibold truncate">{row.name}</span>
                  </span>
                  <StatusBadge label={row.statusLabel} fg={row.statusFg} bg={row.statusBg} />
                </div>
                <div className="flex gap-[18px] flex-wrap">
                  {[
                    { label: 'In', value: row.checkIn, color: 'var(--color-text)' },
                    { label: 'Out', value: row.checkOut, color: row.outColor },
                    { label: 'Duration', value: row.duration, color: 'var(--color-muted)' },
                  ].map((field) => (
                    <div key={field.label}>
                      <div className="font-mono text-[10px] font-medium uppercase tracking-[0.06em] text-[var(--color-subtle)] mb-0.5">
                        {field.label}
                      </div>
                      <div
                        className="font-mono text-[13px] font-medium"
                        style={{ color: field.color }}
                      >
                        {field.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AttendanceRecordGroups({ groups }) {
  const { isMobile } = useBreakpoint();

  if (!groups?.length) return null;
  return isMobile ? <MobileCards groups={groups} /> : <DesktopTable groups={groups} />;
}
