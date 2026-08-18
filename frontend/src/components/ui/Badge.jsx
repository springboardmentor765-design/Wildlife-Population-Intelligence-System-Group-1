import { clsx } from '../../utils/cn';
import { IUCN } from '../../utils/constants';

const tones = {
  neutral: 'bg-sand-100 text-ink-700 ring-sand-300',
  moss: 'bg-moss-50 text-moss-700 ring-moss-200',
  clay: 'bg-orange-50 text-clay-500 ring-orange-200',
  danger: 'bg-red-50 text-red-800 ring-red-200',
  warn: 'bg-amber-50 text-amber-900 ring-amber-200',
  info: 'bg-sky-50 text-sky-800 ring-sky-200',
};

export function Badge({ tone = 'neutral', className = '', children, dot }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset whitespace-nowrap',
        tones[tone], className
      )}
    >
      {dot && <span className={clsx('h-1.5 w-1.5 rounded-full', dot)} />}
      {children}
    </span>
  );
}

/** IUCN Red List badge, coloured to the official category palette. */
export function IucnBadge({ code, showLabel = true, className = '' }) {
  const c = IUCN[code];
  if (!c) {
    return (
      <span className={clsx('inline-flex items-center gap-1.5 rounded-full bg-sand-100 px-2.5 py-1 text-[11px] font-semibold text-ink-500 ring-1 ring-inset ring-sand-300', className)}>
        Not evaluated
      </span>
    );
  }
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset',
        c.bg, c.text, c.ring, className
      )}
      title={`IUCN Red List: ${c.label}`}
    >
      <span className={clsx('h-2 w-2 rounded-[2px]', c.dot)} />
      {showLabel ? c.label : c.code}
    </span>
  );
}

const statusTone = {
  active: 'moss', online: 'moss', analyzed: 'moss', accepted: 'moss',
  maintenance: 'warn', processing: 'warn', review: 'warn', invited: 'info',
  offline: 'danger', suspended: 'danger', failed: 'danger',
};

export function StatusBadge({ status, className = '' }) {
  const label = String(status).replace(/_/g, ' ');
  return (
    <Badge tone={statusTone[status] ?? 'neutral'} className={clsx('capitalize', className)}>
      {label}
    </Badge>
  );
}
