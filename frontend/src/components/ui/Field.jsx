import { clsx } from '../../utils/cn';

export function Field({ label, error, hint, required, children, className = '' }) {
  return (
    <div className={className}>
      <label className="field-label">
        {label} {required && <span className="text-clay-500">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-ink-500">{hint}</p>}
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function Input({ className = '', invalid, ...props }) {
  return <input className={clsx('field-input', invalid && 'border-red-400 focus:ring-red-100', className)} {...props} />;
}

export function Select({ className = '', children, ...props }) {
  return (
    <select className={clsx('field-input pr-8 appearance-none bg-no-repeat', className)} {...props}>
      {children}
    </select>
  );
}

export function Textarea({ className = '', ...props }) {
  return <textarea className={clsx('field-input min-h-[96px] resize-y', className)} {...props} />;
}
