import { clsx } from '../../utils/cn';

export function ProgressBar({ label, value, max = 100, weight, color = '#2C7A5B', sublabel }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <div className="flex items-baseline gap-2 min-w-0">
          <span className="text-sm text-ink-700 truncate">{label}</span>
          {weight !== undefined && (
            <span className="font-mono text-[11px] text-ink-500 shrink-0">×{weight}%</span>
          )}
        </div>
        <span className="font-mono text-sm text-ink-900 tabular-nums shrink-0">
          {typeof value === 'number' ? value.toFixed(value % 1 ? 2 : 0) : value}
          {max === 100 ? '' : `/${max}`}
        </span>
      </div>
      <div className={clsx('h-2 rounded-full bg-sand-200 overflow-hidden')}>
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      {sublabel && <p className="mt-1.5 text-xs text-ink-500">{sublabel}</p>}
    </div>
  );
}
