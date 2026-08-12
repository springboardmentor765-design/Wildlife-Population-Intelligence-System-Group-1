import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Bird, Minus, Search, TrendingDown, TrendingUp } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardBody } from '../components/ui/Card';
import { Badge, IucnBadge } from '../components/ui/Badge';
import { Select } from '../components/ui/Field';
import { SkeletonCards } from '../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../components/ui/States';
import { Button } from '../components/ui/Button';
import { useAsync, useDebounced } from '../hooks/useAsync';
import { speciesService } from '../services/speciesService';
import { speciesGroups } from '../mock/species';
import { IUCN } from '../utils/constants';
import { formatNumber, timeAgo } from '../utils/format';

const TrendIcon = { up: TrendingUp, down: TrendingDown, flat: Minus };
const trendTone = { up: 'text-moss-600', down: 'text-orange-600', flat: 'text-ink-500' };
const trendWord = { up: 'Increasing', down: 'Declining', flat: 'Stable' };

export default function SpeciesExplorer() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [group, setGroup] = useState('All groups');
  const [status, setStatus] = useState('');
  const debounced = useDebounced(query);

  const { data: species, loading, error, reload } = useAsync(
    () => speciesService.list({ q: debounced, group, iucn: status || undefined }),
    [debounced, group, status]
  );

  const onSearch = (v) => {
    setQuery(v);
    if (v) setParams({ q: v }, { replace: true });
    else setParams({}, { replace: true });
  };

  return (
    <>
      <PageHeader
        eyebrow="Reference"
        title="Species explorer"
        description="Every species confirmed across the monitoring network, with its Red List category and observation count."
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
          <input
            value={query}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search common name, binomial or family"
            className="w-full rounded-lg border border-sand-200 bg-white py-2.5 pl-9 pr-3 text-sm shadow-card focus:border-moss-300 focus:outline-none focus:ring-2 focus:ring-moss-100"
          />
        </div>
        <Select value={group} onChange={(e) => setGroup(e.target.value)} className="sm:w-48">
          {speciesGroups.map((g) => <option key={g}>{g}</option>)}
        </Select>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-56">
          <option value="">All Red List categories</option>
          {Object.values(IUCN).map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
        </Select>
      </div>

      {loading && <SkeletonCards count={6} height="h-52" />}
      {error && !loading && <ErrorState message={error} onRetry={reload} />}

      {!loading && !error && species?.length === 0 && (
        <Card>
          <EmptyState
            icon={Bird}
            title="Nothing matches that search"
            message="Try a shorter term, or clear the group and Red List filters to widen the results."
            action={
              <Button variant="secondary" onClick={() => { onSearch(''); setGroup('All groups'); setStatus(''); }}>
                Clear filters
              </Button>
            }
          />
        </Card>
      )}

      {!loading && !error && species?.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {species.map((s) => {
            const Trend = TrendIcon[s.trend];
            return (
              <Card key={s.id} className="transition hover:shadow-lift">
                <CardBody className="pt-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-display text-lg leading-snug text-ink-900">{s.common}</h3>
                      <p className="binomial text-[13px]">{s.binomial}</p>
                    </div>
                    <IucnBadge code={s.iucn} showLabel={false} />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <Badge>{s.group}</Badge>
                    <Badge>{s.order}</Badge>
                    <Badge>{s.family}</Badge>
                  </div>

                  <p className="mt-3 text-[13px] leading-relaxed text-ink-500">{s.note}</p>

                  <div className="mt-4 flex items-end justify-between gap-3 border-t border-sand-200 pt-4">
                    <div>
                      <p className="font-display text-2xl leading-none text-ink-900">{formatNumber(s.observations)}</p>
                      <p className="mt-1 text-[12px] text-ink-500">observations · {s.sites} sites</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center gap-1.5 text-[13px] font-medium ${trendTone[s.trend]}`}>
                        <Trend size={15} /> {trendWord[s.trend]}
                      </span>
                      <p className="mt-1 text-[12px] text-ink-500">last seen {timeAgo(s.lastSeen)}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
