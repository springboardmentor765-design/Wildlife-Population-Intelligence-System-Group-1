import { useState } from 'react';
import { BellOff, CheckCheck, ShieldAlert, TrendingDown, TreePine, WifiOff } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SkeletonTable } from '../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../components/ui/States';
import { useAsync } from '../hooks/useAsync';
import { alertService } from '../services/alertService';
import { formatDateTime, timeAgo } from '../utils/format';
import { clsx } from '../utils/cn';

const TYPES = [
  { key: '', label: 'All alerts', icon: null },
  { key: 'endangered_species', label: 'Endangered species', icon: ShieldAlert },
  { key: 'population_decline', label: 'Population decline', icon: TrendingDown },
  { key: 'habitat_degradation', label: 'Habitat degradation', icon: TreePine },
  { key: 'device_offline', label: 'Device offline', icon: WifiOff },
];

const severityTone = { critical: 'danger', high: 'clay', moderate: 'warn', low: 'neutral' };
const severityBar = {
  critical: 'bg-red-500', high: 'bg-clay-500', moderate: 'bg-amber-400', low: 'bg-moss-400',
};

export default function Alerts() {
  const [type, setType] = useState('');
  const { data: alerts, loading, error, reload } = useAsync(
    () => alertService.list({ type: type || undefined }),
    [type]
  );

  const unread = alerts?.filter((a) => !a.read).length ?? 0;

  const markAll = async () => {
    await alertService.markAllRead();
    reload();
  };

  const markOne = async (id) => {
    await alertService.markRead(id);
    reload();
  };

  return (
    <>
      <PageHeader
        eyebrow="Operations"
        title="Alerts"
        description="Raised automatically when detections, indices or devices cross a monitoring threshold."
        actions={
          unread > 0 && (
            <Button variant="secondary" icon={CheckCheck} onClick={markAll}>
              Mark all as read
            </Button>
          )
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <button
            key={t.key}
            onClick={() => setType(t.key)}
            className={clsx(
              'inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-medium transition',
              type === t.key
                ? 'border-moss-500 bg-moss-500 text-white'
                : 'border-sand-300 bg-white text-ink-700 hover:border-moss-300 hover:text-moss-600'
            )}
          >
            {t.icon && <t.icon size={15} />}
            {t.label}
          </button>
        ))}
      </div>

      <Card>
        {loading && <SkeletonTable rows={5} cols={3} />}
        {error && !loading && <ErrorState message={error} onRetry={reload} />}

        {!loading && !error && alerts?.length === 0 && (
          <EmptyState
            icon={BellOff}
            title="Nothing raised in this category"
            message="Alerts appear here as soon as a threshold is crossed. Switch categories to see the rest."
          />
        )}

        {!loading && !error && alerts?.length > 0 && (
          <ul className="divide-y divide-sand-100">
            {alerts.map((a) => (
              <li key={a.id} className={clsx('flex gap-4 px-5 py-4', !a.read && 'bg-moss-50/40')}>
                <span className={clsx('mt-1 w-1 shrink-0 self-stretch rounded-full', severityBar[a.severity])} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className={clsx('text-[15px] leading-snug text-ink-900', !a.read && 'font-semibold')}>
                      {a.title}
                    </p>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge tone={severityTone[a.severity]} className="capitalize">{a.severity}</Badge>
                      {!a.read && (
                        <button onClick={() => markOne(a.id)} className="text-[12px] font-medium text-moss-600 hover:underline">
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-ink-500">{a.detail}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-ink-500">
                    <span>{a.site}</span>
                    {a.species && <><span>·</span><em className="italic">{a.species}</em></>}
                    <span>·</span>
                    <span title={formatDateTime(a.at)}>{timeAgo(a.at)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
