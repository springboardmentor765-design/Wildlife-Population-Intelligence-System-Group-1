import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { clsx } from '../../utils/cn';
import { formatNumber } from '../../utils/format';

export function StatTile({ label, value, unit = '', delta, icon: Icon, tone = 'moss', hint }) {
  const dir = delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';
  const DeltaIcon = dir === 'up' ? ArrowUpRight : dir === 'down' ? ArrowDownRight : Minus;
  const deltaTone =
    dir === 'up' ? 'text-moss-600 bg-moss-50' : dir === 'down' ? 'text-orange-700 bg-orange-50' : 'text-ink-500 bg-sand-100';

  const iconTone = {
    moss: 'bg-moss-50 text-moss-500',
    clay: 'bg-orange-50 text-clay-500',
    bark: 'bg-amber-50 text-bark-500',
    danger: 'bg-red-50 text-red-600',
  }[tone];

  return (
    <div className="bg-white rounded-2xl border border-sand-200/70 shadow-card p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] text-ink-500 leading-snug">{label}</p>
        {Icon && (
          <span className={clsx('grid place-items-center h-9 w-9 rounded-xl shrink-0', iconTone)}>
            <Icon size={17} />
          </span>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-display text-3xl text-ink-900 tabular-nums">
          {typeof value === 'number' ? formatNumber(value) : value}
        </span>
        {unit && <span className="text-sm text-ink-500">{unit}</span>}
      </div>
      {(delta !== undefined || hint) && (
        <div className="mt-3 flex items-center gap-2">
          {delta !== undefined && (
            <span className={clsx('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold', deltaTone)}>
              <DeltaIcon size={12} />
              {Math.abs(delta)}%
            </span>
          )}
          {hint && <span className="text-[12px] text-ink-500 truncate">{hint}</span>}
        </div>
      )}
    </div>
  );
}
