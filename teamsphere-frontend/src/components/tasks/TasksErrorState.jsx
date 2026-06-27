import { RefreshCw, AlertTriangle } from 'lucide-react';
import Button from '../Button';

export default function TasksErrorState({ onRetry }) {
  return (
    <div
      className="flex flex-col items-center text-center px-6 py-16"
      style={{ animation: 'ds-rise .4s cubic-bezier(.2,.8,.2,1) both' }}
    >
      <div className="w-[84px] h-[84px] rounded-[22px] bg-[var(--color-danger-subtle)] grid place-items-center mb-6 text-[var(--color-danger)]">
        <AlertTriangle size={38} strokeWidth={1.7} />
      </div>
      <h3 className="font-serif text-[24px] font-medium tracking-[-0.01em] text-[var(--color-text)] m-0 mb-2.5">
        Couldn&apos;t load tasks
      </h3>
      <p className="text-[15px] leading-[1.6] text-[var(--color-muted)] m-0 mb-[26px] max-w-[42ch]">
        Something went wrong reaching the server. Your tasks are safe — try again in a moment.
      </p>
      <Button onClick={onRetry} icon={<RefreshCw size={16} />}>
        Retry
      </Button>
    </div>
  );
}
