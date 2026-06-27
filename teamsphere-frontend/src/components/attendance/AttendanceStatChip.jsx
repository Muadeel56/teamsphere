export default function AttendanceStatChip({ value, label, tintBg, tintFg, icon }) {
  return (
    <div
      className="flex items-center gap-[13px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[13px] px-4 py-[15px] shadow-[var(--shadow-sm)]"
      style={{ animation: 'ds-rise .4s cubic-bezier(.2,.8,.2,1) both' }}
    >
      <span
        className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[10px]"
        style={{ background: tintBg, color: tintFg }}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <div className="font-serif text-[30px] leading-none font-medium tracking-[-0.01em] text-[var(--color-text)]">
          {value}
        </div>
        <div className="mt-1 text-xs font-medium text-[var(--color-muted)]">{label}</div>
      </div>
    </div>
  );
}
