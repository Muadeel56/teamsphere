import { CalendarRange } from 'lucide-react';
import Button from '../Button';
import EmptyState from '../EmptyState';

export default function AttendanceEmptyState({ onWidenRange }) {
  return (
    <EmptyState
      eyebrow="Attendance"
      title="No attendance in this range"
      description="Nobody has checked in for the selected dates. Try a wider range or check in to log your own time."
      icon={
        <div
          className="w-[84px] h-[84px] rounded-[22px] bg-[var(--color-surface-2)] border border-[var(--color-border)] grid place-items-center mb-6 text-[var(--color-primary)]"
          style={{ animation: 'ds-floaty 3s ease-in-out infinite alternate' }}
        >
          <CalendarRange size={38} strokeWidth={1.6} />
        </div>
      }
      secondaryAction={
        onWidenRange ? (
          <Button variant="secondary" onClick={onWidenRange}>
            Widen to this month
          </Button>
        ) : null
      }
    />
  );
}
