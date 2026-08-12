import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Info } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { HealthGauge } from '../components/ui/HealthGauge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Skeleton, SkeletonChart } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/States';
import { useAsync } from '../hooks/useAsync';
import { healthService } from '../services/healthService';
import { HEALTH_BANDS, HEALTH_WEIGHTS } from '../utils/constants';
import { formatDateTime, healthBand } from '../utils/format';

const componentColor = (v) => (v >= 80 ? '#2C7A5B' : v >= 65 ? '#4E9E7A' : v >= 50 ? '#C4854C' : '#FC7F3F');

export default function EcosystemHealth() {
  const { data, loading, error, reload } = useAsync(() => healthService.get(), []);

  return (
    <>
      <PageHeader
        eyebrow="Intelligence"
        title="Ecosystem health score"
        description="One weighted number for the landscape, and the five measurements it is built from."
      />

      {loading && (
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <Skeleton className="h-[420px] rounded-2xl" />
          <div className="space-y-6">
            <Skeleton className="h-[300px] rounded-2xl" />
            <SkeletonChart className="h-64" />
          </div>
        </div>
      )}
      {error && !loading && <ErrorState message={error} onRetry={reload} />}

      {data && !loading && !error && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
            <Card>
              <CardBody className="flex flex-col items-center pt-8">
                <HealthGauge score={data.score} />
                <p className="mt-6 text-center text-[13px] text-ink-500">
                  {data.landscape}
                  <br />
                  Computed {formatDateTime(data.computedAt)}
                </p>
                <p className="mt-3 text-center text-sm text-ink-700">
                  Up{' '}
                  <span className="font-mono text-moss-600">
                    {data.score - data.previousScore} points
                  </span>{' '}
                  since the last assessment.
                </p>

                <div className="mt-6 w-full border-t border-sand-200 pt-4">
                  <p className="eyebrow mb-2.5">Bands</p>
                  <ul className="space-y-1.5">
                    {HEALTH_BANDS.map((b, i) => {
                      const upper = i === 0 ? 100 : HEALTH_BANDS[i - 1].min - 1;
                      const isCurrent = healthBand(data.score).label === b.label;
                      return (
                        <li
                          key={b.label}
                          className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[13px] ${isCurrent ? 'bg-sand-100 font-medium' : ''}`}
                        >
                          <span className="inline-flex items-center gap-2 text-ink-700">
                            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: b.color }} />
                            {b.label}
                          </span>
                          <span className="font-mono text-[12px] text-ink-500">{b.min}–{upper}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </CardBody>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader
                  eyebrow="Weighted model"
                  title="What makes up the score"
                  description="Each component is scored out of 100, then multiplied by its weight."
                />
                <CardBody className="space-y-5">
                  {HEALTH_WEIGHTS.map((w) => {
                    const value = data.components[w.key];
                    return (
                      <ProgressBar
                        key={w.key}
                        label={w.label}
                        weight={w.weight}
                        value={value}
                        color={componentColor(value)}
                        sublabel={`Contributes ${((value * w.weight) / 100).toFixed(1)} points to the total`}
                      />
                    );
                  })}

                  <div className="flex items-start gap-2.5 rounded-xl bg-sand-50 p-4">
                    <Info size={16} className="mt-0.5 shrink-0 text-moss-500" />
                    <p className="text-[13px] leading-relaxed text-ink-500">
                      Weights follow the platform scoring model: species diversity 30%, population
                      stability 25%, habitat quality 20%, endangered species status 15%, environmental
                      conditions 10%.
                    </p>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader eyebrow="Eight quarters" title="Score history" />
                <CardBody>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={data.history} margin={{ top: 8, right: 8, bottom: 0, left: -22 }}>
                      <CartesianGrid stroke="#E7E1D5" vertical={false} />
                      <XAxis dataKey="quarter" tick={{ fontSize: 11, fill: '#5B6560' }} tickLine={false} axisLine={{ stroke: '#E7E1D5' }} />
                      <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: '#5B6560' }} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E7E1D5', fontSize: 12 }} />
                      <Line type="monotone" dataKey="score" name="Health score" stroke="#2C7A5B" strokeWidth={2.5} dot={{ r: 3, fill: '#2C7A5B' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardBody>
              </Card>
            </div>
          </div>

          <Card>
            <CardHeader eyebrow="Reading the number" title="What moved the score" />
            <CardBody>
              <ul className="space-y-2.5">
                {data.drivers.map((d, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-ink-700">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-moss-500" />
                    {d}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>
      )}
    </>
  );
}
