import { statusTooltip } from '../../lib/attendanceHelpers';

const STATUS_COLORS = {
  present: 'var(--color-success)',
  absent: 'var(--color-subtle)',
  late: 'var(--color-warning)',
  incomplete: 'var(--color-warning)',
};

const STATUS_LABELS = {
  present: 'Present',
  absent: 'Absent',
  late: 'Late',
  incomplete: 'In progress',
};

export default function StatusDot({ status, record }) {
  const color = STATUS_COLORS[status] ?? STATUS_COLORS.absent;
  const label = STATUS_LABELS[status] ?? status;
  const tooltip = statusTooltip(status, record);

  return (
    <span
      role="img"
      aria-label={tooltip || label}
      title={tooltip}
      style={{
        display: 'inline-block',
        width: '8px',
        height: '8px',
        borderRadius: '999px',
        background: color,
        flexShrink: 0,
      }}
    />
  );
}
