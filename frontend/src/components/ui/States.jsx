import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

/** Empty screens invite an action; they never just say "no data". */
export function EmptyState({ icon: Icon, title, message, action, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center text-center px-6 py-14 ${className}`}>
      {Icon && (
        <span className="grid place-items-center h-14 w-14 rounded-2xl bg-moss-50 text-moss-400 mb-4">
          <Icon size={24} />
        </span>
      )}
      <h3 className="font-display text-lg text-ink-900">{title}</h3>
      <p className="text-sm text-ink-500 mt-1.5 max-w-sm">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/** Errors state what failed and how to recover — no apologies. */
export function ErrorState({ message = 'The request did not complete.', onRetry, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center text-center px-6 py-14 ${className}`}>
      <span className="grid place-items-center h-14 w-14 rounded-2xl bg-red-50 text-red-600 mb-4">
        <AlertTriangle size={24} />
      </span>
      <h3 className="font-display text-lg text-ink-900">Could not load this view</h3>
      <p className="text-sm text-ink-500 mt-1.5 max-w-sm">{message}</p>
      {onRetry && (
        <Button variant="secondary" icon={RefreshCw} className="mt-5" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
