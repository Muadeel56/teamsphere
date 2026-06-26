const LEVELS = [
  { label: 'Weak',   hint: 'Use 8+ chars, mixed case, a number',  color: 'var(--color-danger)'  },
  { label: 'Weak',   hint: 'Use 8+ chars, mixed case, a number',  color: 'var(--color-danger)'  },
  { label: 'Fair',   hint: 'Use 8+ chars, mixed case, a number',  color: 'var(--color-warning)' },
  { label: 'Good',   hint: 'Add a symbol to strengthen',           color: 'var(--color-info)'    },
  { label: 'Strong', hint: 'Strong — nice work',                   color: 'var(--color-success)' },
];

function getScore(p) {
  let score = 0;
  if (p.length >= 8) score++;
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) score++;
  if (/\d/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  return score;
}

export default function PasswordStrengthMeter({ password }) {
  if (!password) return null;

  const score = getScore(password);
  const level = LEVELS[score];

  return (
    <div className="mt-2.5">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-[3px] flex-1 rounded-full transition-colors duration-300"
            style={{ background: i < score ? level.color : 'var(--panel-line)' }}
          />
        ))}
      </div>
      <p className="mt-[7px] text-[12px] font-medium" style={{ color: level.color }}>
        {level.label}{' '}
        <span className="font-normal text-[var(--color-subtle)]">— {level.hint}</span>
      </p>
    </div>
  );
}
