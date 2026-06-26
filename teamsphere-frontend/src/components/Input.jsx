import { cn } from '../lib/utils';

export default function Input({ icon = null, className = '', ...props }) {
  return (
    <div className={cn('relative flex items-center', className)}>
      {icon && <span className="absolute left-3 text-gray-400">{icon}</span>}
      <input
        className={cn('ts-input', icon && 'pl-10')}
        {...props}
      />
    </div>
  );
}
