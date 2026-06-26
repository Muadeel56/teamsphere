import { cn } from '../lib/utils';

export default function Card({ children, className = '', ...props }) {
  return (
    <div className={cn('ts-card', className)} {...props}>
      {children}
    </div>
  );
}
