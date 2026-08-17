import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Bird, Search } from 'lucide-react';

import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardBody } from '../components/ui/Card';
import { SkeletonCards } from '../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../components/ui/States';
import { Button } from '../components/ui/Button';
import { useAsync, useDebounced } from '../hooks/useAsync';
import { speciesService } from '../services/speciesService';
import { formatNumber } from '../utils/format';

export default function SpeciesExplorer() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const debounced = useDebounced(query);

  const { data: species, loading, error, reload } = useAsync(
    () => speciesService.list({ q: debounced }),
    [debounced]
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
        description="Explore species identified through image and audio wildlife monitoring."
      />

      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500"
          />

          <input
            value={query}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search detected species..."
            className="w-full rounded-lg border border-sand-200 bg-white py-2.5 pl-9 pr-3 text-sm shadow-card focus:border-moss-300 focus:outline-none focus:ring-2 focus:ring-moss-100"
          />
        </div>

        {!loading && !error && species && (
          <p className="shrink-0 text-sm text-ink-500">
            {species.length} species detected
          </p>
        )}
      </div>

      {loading && <SkeletonCards count={6} height="h-52" />}
      {error && !loading && <ErrorState message={error} onRetry={reload} />}

      {!loading && !error && species?.length === 0 && (
        <Card>
          <EmptyState
            icon={Bird}
            title="Nothing matches that search"
            message="Try a different species name or clear the search to see all detected species."
            action={
              <Button variant="secondary" onClick={() => onSearch('') }>
                Clear filters
              </Button>
            }
          />
        </Card>
      )}

      {!loading && !error && species?.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {species.map((s) => (
  <Card key={s.id} className="overflow-hidden transition hover:shadow-lift">

    {s.imageUrl ? (
      <img
        src={s.imageUrl}
        alt={s.common}
        className="h-44 w-full object-cover"
      />
    ) : (
      <div className="flex h-44 w-full items-center justify-center bg-sage-50">
        <Bird size={48} className="text-moss-600" />
      </div>
    )}

    <CardBody className="pt-5">

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">

          <h3 className="font-display text-lg leading-snug text-ink-900">
            {s.common}
          </h3>

          <p className="mt-1 text-[12px] text-ink-500">
            Species detected by the wildlife monitoring system
          </p>

        </div>

        <Bird
          size={20}
          className="shrink-0 text-moss-600"
        />

      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">

        <div className="rounded-lg bg-sand-50 p-3">
          <p className="text-[11px] uppercase tracking-wide text-ink-500">
            Population
          </p>

          <p className="mt-1 font-display text-2xl text-ink-900">
            {formatNumber(s.population)}
          </p>
        </div>

        <div className="rounded-lg bg-sand-50 p-3">
          <p className="text-[11px] uppercase tracking-wide text-ink-500">
            Observations
          </p>

          <p className="mt-1 font-display text-2xl text-ink-900">
            {formatNumber(s.observations)}
          </p>
        </div>

        <div className="rounded-lg bg-sand-50 p-3">
          <p className="text-[11px] uppercase tracking-wide text-ink-500">
            Confidence
          </p>

          <p className="mt-1 font-display text-2xl text-ink-900">
            {s.averageConfidence}%
          </p>
        </div>

      </div>

    </CardBody>
  </Card>
))}
        </div>
      )}
    </>
  );
}
