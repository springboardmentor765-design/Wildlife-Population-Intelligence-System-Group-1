import { clsx } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-moss-500 text-white hover:bg-moss-600 shadow-sm',
  secondary: 'bg-white text-ink-900 border border-sand-300 hover:bg-sand-50',
  ghost: 'text-ink-700 hover:bg-sand-100',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  earth: 'bg-clay-500 text-white hover:bg-clay-400',
};

const sizes = {
  sm: 'px-3 py-1.5 text-[13px] gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-5 py-3 text-[15px] gap-2',
};

export function Button({
  variant = 'primary', size = 'md', loading = false, icon: Icon,
  className = '', children, disabled, ...props
}) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center font-medium rounded-lg transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant], sizes[size], className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : Icon && <Icon size={16} />}
      {children}
    </button>
  );
}
