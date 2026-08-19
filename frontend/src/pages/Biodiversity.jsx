import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AlertTriangle, TreePine } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { SkeletonCards, SkeletonChart } from '../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../components/ui/States';
import { useAsync } from '../hooks/useAsync';
import { habitatService } from '../services/habitatService';
import { formatDate } from '../utils/format';

const qualityColor = (q) => (q >= 75 ? '#2C7A5B' : q >= 60 ? '#4E9E7A' : q >= 45 ? '#C4854C' : '#D81E05');
const severityTone = { critical: 'danger', high: 'clay', moderate: 'warn', low: 'neutral' };
const trendTone = { improving: 'moss', stable: 'neutral', declining: 'clay' };

export default function Biodiversity() {
  const { data, loading, error, reload } = useAsync(() => habitatService.biodiversity(), []);

  return (
    <>
      <PageHeader
        eyebrow="Intelligence"
        title="Biodiversity & habitat"
        description="Diversity indices computed from confirmed detections, alongside the condition of the ground they came from."
      />

      {loading && (
        <div className="space-y-6">
          <SkeletonCards count={4} height="h-40" />
          <SkeletonChart className="h-80" />
        </div>
      )}
      {error && !loading && <ErrorState message={error} onRetry={reload} />}

      {data && !loading && !error && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {data.indices.map((ix) => (
              <Card key={ix.key}>
                <CardBody className="pt-5">
                  <p className="text-[13px] text-ink-500">{ix.label}</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-3xl text-ink-900 tabular-nums">
                      {ix.value % 1 ? ix.value.toFixed(2) : ix.value}
                    </span>
                    <span className="text-sm text-ink-500">/ {ix.max}</span>
                    <span className={`ml-auto font-mono text-[12px] ${ix.delta >= 0 ? 'text-moss-600' : 'text-orange-600'}`}>
                      {ix.delta >= 0 ? '+' : ''}{ix.delta}
                    </span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-sand-200">
                    <div className="h-full rounded-full bg-moss-500" style={{ width: `${(ix.value / ix.max) * 100}%` }} />
                  </div>
                  <p className="mt-3 text-[12px] leading-relaxed text-ink-500">{ix.hint}</p>
                </CardBody>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
            <Card>
              <CardHeader eyebrow="By site" title="Habitat quality" description="Composite of canopy cover, vegetation index, water and fragmentation." />
              <CardBody className="space-y-5">
                {data.habitats.map((h) => (
                  <div key={h.id} className="rounded-xl border border-sand-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-ink-900">{h.site}</p>
                        <p className="text-[12px] text-ink-500">{h.type}</p>
                      </div>
                      <Badge tone={trendTone[h.trend]} className="capitalize">{h.trend}</Badge>
                    </div>

                    <div className="mt-4">
                      <ProgressBar label="Habitat quality score" value={h.quality} color={qualityColor(h.quality)} />
                    </div>

                    <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-[13px] sm:grid-cols-4">
                      {[
                        ['Canopy cover', `${h.canopyCover}%`],
                        ['Vegetation index', h.vegetationIndex.toFixed(2)],
                        ['Water', h.waterAvailability],
                        ['Fragmentation', h.fragmentation],
                      ].map(([k, v]) => (
                        <div key={k}>
                          <dt className="text-ink-500">{k}</dt>
                          <dd className="font-mono text-ink-900">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </CardBody>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader eyebrow="Satellite derived" title="Vegetation through the season" description="NDVI and canopy cover across the landscape." />
                <CardBody>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={data.vegetation} margin={{ top: 8, right: 8, bottom: 0, left: -22 }}>
                      <defs>
                        <linearGradient id="ndviFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2C7A5B" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="#2C7A5B" stopOpacity={0.03} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#E7E1D5" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#5B6560' }} tickLine={false} axisLine={{ stroke: '#E7E1D5' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#5B6560' }} tickLine={false} axisLine={false} domain={[0, 1]} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E7E1D5', fontSize: 12 }} />
                      <Area type="monotone" dataKey="ndvi" name="NDVI" stroke="#2C7A5B" strokeWidth={2} fill="url(#ndviFill)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardBody>
              </Card>

              <Card>
                <CardHeader eyebrow="Needs action" title="Degradation alerts" />
                {data.degradation.length === 0 ? (
                  <EmptyState icon={TreePine} title="No degradation detected" message="Vegetation indices are holding steady across every monitored site." />
                ) : (
                  <CardBody className="space-y-3">
                    {data.degradation.map((d) => (
                      <div key={d.id} className="rounded-xl border border-sand-200 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5 min-w-0">
                            <AlertTriangle
                              size={16}
                              className={`mt-0.5 shrink-0 ${d.severity === 'critical' ? 'text-red-600' : 'text-clay-500'}`}
                            />
                            <div className="min-w-0">
                              <p className="truncate font-medium text-ink-900">{d.site}</p>
                              <p className="font-mono text-[12px] text-ink-700">{d.change}</p>
                            </div>
                          </div>
                          <Badge tone={severityTone[d.severity]} className="capitalize">{d.severity}</Badge>
                        </div>
                        <p className="mt-2.5 text-[13px] leading-relaxed text-ink-500">{d.cause}</p>
                        <p className="mt-2 font-mono text-[11px] text-ink-500">Detected {formatDate(d.detected)}</p>
                      </div>
                    ))}
                  </CardBody>
                )}
              </Card>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
