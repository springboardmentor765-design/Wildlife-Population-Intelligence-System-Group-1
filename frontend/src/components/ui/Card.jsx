import { clsx } from '../../utils/cn';

export function Card({ className = '', children, ...props }) {
  return (
    <div
      className={clsx(
        'bg-white rounded-2xl shadow-card border border-sand-200/70 overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, eyebrow, action, description, className = '' }) {
  return (
    <div className={clsx('flex items-start justify-between gap-4 px-5 pt-5 pb-4', className)}>
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow mb-1.5">{eyebrow}</p>}
        <h3 className="font-display text-lg font-medium text-ink-900 leading-snug">{title}</h3>
        {description && <p className="text-sm text-ink-500 mt-1">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function CardBody({ className = '', children }) {
  return <div className={clsx('px-5 pb-5', className)}>{children}</div>;
}

export function CardFooter({ className = '', children }) {
  return (
    <div className={clsx('px-5 py-3.5 bg-sand-50 border-t border-sand-200', className)}>
      {children}
    </div>
  );
}
