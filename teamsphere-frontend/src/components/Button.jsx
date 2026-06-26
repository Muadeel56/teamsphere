import { cn } from '../lib/utils';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  icon = null,
  ...props
}) {
  const variantClass =
    variant === 'primary' ? 'ts-btn-primary' : 'ts-btn-outline';
  const sizeClass = size === 'sm' ? 'px-3 py-1.5 text-sm' : '';

  return (
    <button
      className={cn(variantClass, sizeClass, className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      )}
      {icon}
      {children}
    </button>
  );
}
