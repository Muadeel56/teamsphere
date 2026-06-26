export default function Attendance() {
  return (
    <div>
      <h2 className="font-serif text-[30px] leading-[1.15] font-medium tracking-[-0.01em] text-[var(--color-text)]">
        Attendance
      </h2>
      <p className="mt-2 text-[15px] text-[var(--color-muted)]">
        Track check-ins and team presence.
      </p>

      <div className="mt-6 rounded-[14px] border-[1.5px] border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-2)] p-[26px] text-center">
        <div className="font-mono text-xs font-medium tracking-[0.08em] text-[var(--color-subtle)] uppercase">
          Content slot
        </div>
        <div className="mx-auto mt-2 max-w-[46ch] text-sm text-[var(--color-muted)]">
          Attendance tracking will render here in a future phase.
        </div>
      </div>
    </div>
  );
}
