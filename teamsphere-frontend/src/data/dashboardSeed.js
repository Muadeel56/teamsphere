export const VELOCITY_BARS = [
  { d: 'M', h: '46%', peak: false },
  { d: 'T', h: '63%', peak: false },
  { d: 'W', h: '52%', peak: false },
  { d: 'T', h: '78%', peak: true },
  { d: 'F', h: '88%', peak: true },
  { d: 'S', h: '34%', peak: false },
  { d: 'S', h: '22%', peak: false },
];

export const RECENT_ACTIVITY = [
  {
    initials: 'MK',
    color: 'oklch(0.56 0.105 262)',
    text: 'Mikhail moved "Auth flow" to In Review',
    time: '12 min ago',
  },
  {
    initials: 'JD',
    color: 'oklch(0.555 0.16 25)',
    text: 'Jordan completed 4 tasks in Q3 Launch',
    time: '40 min ago',
  },
  {
    initials: 'AR',
    color: 'oklch(0.495 0.090 183)',
    text: 'You invited Sana to the Platform team',
    time: '1 hr ago',
  },
  {
    initials: 'TS',
    color: 'oklch(0.55 0.11 150)',
    text: 'Theo logged 6h 20m on Onboarding',
    time: '2 hr ago',
  },
];

export const KPI_DELTAS = {
  projects: { delta: '+2', note: 'this month', semantic: 'success' },
  tasks: { delta: '3', note: 'high priority', semantic: 'warning' },
  teamOnline: { delta: 'of 31', note: 'members', semantic: 'info' },
  attendance: { delta: '+1.2%', note: 'vs last week', semantic: 'success' },
};
