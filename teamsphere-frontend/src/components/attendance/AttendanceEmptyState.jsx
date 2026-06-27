import { CalendarRange } from 'lucide-react';
import Button from '../Button';

export default function AttendanceEmptyState({ onWidenRange }) {
  return (
    <div
      className="flex flex-col items-center text-center px-6 py-16 rounded-[18px] border-[1.5px] border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)]"
      style={{ animation: 'ds-rise .4s cubic-bezier(.2,.8,.2,1) both' }}
    >
      <div
        className="w-[84px] h-[84px] rounded-[22px] bg-[var(--color-surface-2)] border border-[var(--color-border)] grid place-items-center mb-6 text-[var(--color-primary)]"
        style={{ animation: 'ds-floaty 3s ease-in-out infinite alternate' }}
      >
        <CalendarRange size={38} strokeWidth={1.6} />
      </div>
      <h3 className="font-serif text-[24px] font-medium tracking-[-0.01em] text-[var(--color-text)] m-0 mb-2.5">
        No attendance in this range
      </h3>
      <p className="text-[15px] leading-[1.6] text-[var(--color-muted)] m-0 mb-[26px] max-w-[42ch]">
        Nobody has checked in for the selected dates. Try a wider range or check in to log your own
        time.
      </p>
      {onWidenRange && (
        <Button variant="secondary" onClick={onWidenRange}>
          Widen to this month
        </Button>
      )}
    </div>
  );
}
