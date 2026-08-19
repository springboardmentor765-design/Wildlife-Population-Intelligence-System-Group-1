import { clsx } from '../../utils/cn';

export function Skeleton({ className = '' }) {
  return (
    <div className={clsx('relative overflow-hidden rounded-lg bg-sand-200/70', className)}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}

export function SkeletonTiles({ count = 4 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-sand-200/70 p-5 shadow-card">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-20 mt-4" />
          <Skeleton className="h-3 w-16 mt-4" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 6, cols = 5 }) {
  return (
    <div className="p-5">
      <div className="flex gap-4 pb-4 border-b border-sand-200">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 py-4 border-b border-sand-100 last:border-0">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonCards({ count = 6, height = 'h-44' }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={clsx('rounded-2xl', height)} />
      ))}
    </div>
  );
}

export function SkeletonChart({ className = 'h-72' }) {
  return <Skeleton className={clsx('rounded-2xl', className)} />;
}
