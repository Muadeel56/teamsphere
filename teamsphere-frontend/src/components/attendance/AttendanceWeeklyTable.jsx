import Avatar from '../Avatar';
import StatusDot from './StatusDot';
import { DAY_LABELS } from '../../lib/attendanceHelpers';

export default function AttendanceWeeklyTable({ grid }) {
  const dayLabels = grid[0]?.dayLabels ?? grid[0]?.days?.map((d) => d.label) ?? DAY_LABELS;

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '14px',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
        overflowX: 'auto',
        animation: 'ds-rise .4s cubic-bezier(.2,.8,.2,1) both',
      }}
    >
      <table style={{ width: '100%', minWidth: '520px', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th
              style={{
                textAlign: 'left',
                padding: '12px 18px',
                font: "600 11px 'IBM Plex Mono'",
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: 'var(--color-subtle)',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              Member
            </th>
            {dayLabels.map((label) => (
              <th
                key={label}
                style={{
                  textAlign: 'center',
                  padding: '12px 10px',
                  font: "600 11px 'IBM Plex Mono'",
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: 'var(--color-subtle)',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                {label}
              </th>
            ))}
            <th
              style={{
                textAlign: 'right',
                padding: '12px 18px',
                font: "600 11px 'IBM Plex Mono'",
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: 'var(--color-subtle)',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {grid.map((row) => (
            <tr
              key={row.userId}
              style={{ borderTop: '1px solid var(--color-border)', transition: 'background .12s' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-surface-2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '';
              }}
            >
              <td style={{ padding: '12px 18px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Avatar initials={row.initials} size="sm" />
                  <span
                    style={{
                      font: "600 13.5px 'Hanken Grotesk'",
                      color: 'var(--color-text)',
                    }}
                  >
                    {row.name}
                  </span>
                </span>
              </td>
              {row.days.map((day) => (
                <td key={day.date} style={{ padding: '12px 10px', textAlign: 'center' }}>
                  <StatusDot status={day.status} record={day.record} />
                </td>
              ))}
              <td
                style={{
                  padding: '12px 18px',
                  textAlign: 'right',
                  font: "500 13px 'IBM Plex Mono'",
                  color: 'var(--color-muted)',
                  whiteSpace: 'nowrap',
                }}
              >
                {row.totalLabel}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
