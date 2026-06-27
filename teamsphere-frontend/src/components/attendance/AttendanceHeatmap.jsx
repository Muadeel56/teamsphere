export default function AttendanceHeatmap({ weeks = [] }) {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[14px] p-[18px] shadow-[var(--shadow-sm)]">
      <div className="flex items-center justify-between gap-2 mb-1">
        <h3 className="font-serif text-[15px] font-semibold m-0 text-[var(--color-text)]">
          Your attendance
        </h3>
        <span className="font-mono text-[11px] font-medium text-[var(--color-subtle)]">12 wks</span>
      </div>
      <p className="text-xs text-[var(--color-muted)] m-0 mb-4">Hours logged per day</p>
      <div className="flex gap-1 overflow-x-auto pb-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.days.map((day, di) => (
              <div
                key={di}
                title={day.title}
                className="w-[14px] h-[14px] rounded-[3px] shrink-0"
                style={{ background: day.bg }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-1.5 mt-3.5">
        <span className="font-mono text-[10.5px] text-[var(--color-subtle)]">Less</span>
        <div className="w-[11px] h-[11px] rounded-[3px] bg-[var(--color-surface-2)] border border-[var(--color-border)]" />
        <div className="w-[11px] h-[11px] rounded-[3px] bg-[var(--heat-1)]" />
        <div className="w-[11px] h-[11px] rounded-[3px] bg-[var(--heat-2)]" />
        <div className="w-[11px] h-[11px] rounded-[3px] bg-[var(--heat-3)]" />
        <div className="w-[11px] h-[11px] rounded-[3px] bg-[var(--heat-4)]" />
        <span className="font-mono text-[10.5px] text-[var(--color-subtle)]">More</span>
      </div>
    </div>
  );
}
