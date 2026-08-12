import { useState } from 'react';
import { Check, ChevronDown, Lightbulb } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Field';
import { SkeletonCards } from '../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../components/ui/States';
import { useAsync } from '../hooks/useAsync';
import { conservationService } from '../services/conservationService';
import { clsx } from '../utils/cn';

const priorityTone = { critical: 'danger', high: 'clay', moderate: 'warn', low: 'neutral' };

export default function Conservation() {
  const [priority, setPriority] = useState('');
  const { data: items, loading, error, reload } = useAsync(
    () => conservationService.list({ priority: priority || undefined }),
    [priority]
  );
  const [expanded, setExpanded] = useState(null);
  const [accepted, setAccepted] = useState([]);

  const accept = async (id) => {
    await conservationService.accept(id);
    setAccepted((a) => [...a, id]);
  };

  return (
    <>
      <PageHeader
        eyebrow="Intelligence"
        title="Conservation recommendations"
        description="Ranked by modelled impact against the effort each action needs. Highest first."
        actions={
          <Select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-56">
            <option value="">All priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="moderate">Moderate</option>
          </Select>
        }
      />

      {loading && <SkeletonCards count={4} height="h-44" />}
      {error && !loading && <ErrorState message={error} onRetry={reload} />}

      {!loading && !error && items?.length === 0 && (
        <Card>
          <EmptyState
            icon={Lightbulb}
            title="No recommendations at this priority"
            message="Widen the filter to see the full ranked list of actions the model has produced."
            action={<Button variant="secondary" onClick={() => setPriority('')}>Show all priorities</Button>}
          />
        </Card>
      )}

      {!loading && !error && items?.length > 0 && (
        <div className="space-y-4">
          {items.map((r) => {
            const open = expanded === r.id;
            const isAccepted = accepted.includes(r.id);
            return (
              <Card key={r.id}>
                <CardBody className="pt-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    {/* Rank is real information here — the list is impact-ordered */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-canopy-900 font-display text-xl text-white">
                      {r.rank}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-display text-lg leading-snug text-ink-900">{r.title}</h3>
                          <p className="mt-0.5 text-[13px] text-ink-500">{r.site} · {r.category}</p>
                        </div>
                        <Badge tone={priorityTone[r.priority]} className="capitalize">{r.priority}</Badge>
                      </div>

                      <p className="mt-3 text-sm leading-relaxed text-ink-700">{r.rationale}</p>

                      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px]">
                        <span className="text-ink-500">
                          Modelled impact <strong className="font-mono text-ink-900">{r.impact}/100</strong>
                        </span>
                        <span className="text-ink-500">Effort <strong className="text-ink-900">{r.effort}</strong></span>
                        <span className="text-ink-500">Act by <strong className="text-ink-900">{r.window}</strong></span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {r.species.map((s) => <Badge key={s} tone="moss">{s}</Badge>)}
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <Button
                          size="sm"
                          variant={isAccepted ? 'secondary' : 'primary'}
                          icon={isAccepted ? Check : undefined}
                          disabled={isAccepted}
                          onClick={() => accept(r.id)}
                        >
                          {isAccepted ? 'Added to plan' : 'Add to conservation plan'}
                        </Button>
                        <button
                          onClick={() => setExpanded(open ? null : r.id)}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-moss-600 hover:underline"
                        >
                          {open ? 'Hide steps' : `Show ${r.actions.length} steps`}
                          <ChevronDown size={15} className={clsx('transition-transform', open && 'rotate-180')} />
                        </button>
                      </div>

                      {open && (
                        <ol className="mt-4 space-y-2.5 rounded-xl bg-sand-50 p-4 animate-fade-up">
                          {r.actions.map((a, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-ink-700">
                              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-moss-500 font-mono text-[11px] text-white">
                                {i + 1}
                              </span>
                              {a}
                            </li>
                          ))}
                        </ol>
                      )}
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
