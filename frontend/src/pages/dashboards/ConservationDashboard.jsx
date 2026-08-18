import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Activity, ShieldAlert, ListChecks } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { StatTile } from '../../components/ui/StatTile';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { recommendations } from '../../mock/conservation';
import { degradationAlerts } from '../../mock/biodiversity';
import { CHART_COLORS } from '../../utils/constants';
import { formatDate } from '../../utils/format';

const ICONS = { threats: AlertTriangle, endangered: ShieldAlert, priority: ListChecks, health: Activity };

export function ConservationDashboard({ data }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.tiles.map((t) => (
          <StatTile
            key={t.key} label={t.label} value={t.value} unit={t.unit} delta={t.delta}
            icon={ICONS[t.key]} tone={t.key === 'threats' ? 'danger' : 'moss'}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.3fr]">
        <Card>
          <CardHeader eyebrow="Open threats" title="What is driving pressure" description="Share of active threat records by category." />
          <CardBody>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={data.threatBreakdown} dataKey="value" nameKey="name" innerRadius={62} outerRadius={96} paddingAngle={2}>
                  {data.threatBreakdown.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E7E1D5', fontSize: 12 }} formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="mt-3 space-y-2">
              {data.threatBreakdown.map((t, i) => (
                <li key={t.name} className="flex items-center justify-between text-sm">
                  <span className="inline-flex items-center gap-2 text-ink-700">
                    <span className="h-2.5 w-2.5 rounded-sm" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                    {t.name}
                  </span>
                  <span className="font-mono text-ink-900">{t.value}%</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader
              eyebrow="Ranked by impact"
              title="Next conservation actions"
              action={
                <Link to="/conservation" className="inline-flex items-center gap-1.5 text-sm font-medium text-moss-600 hover:underline">
                  All recommendations <ArrowRight size={14} />
                </Link>
              }
            />
            <CardBody className="space-y-3">
              {recommendations.slice(0, 3).map((r) => (
                <div key={r.id} className="rounded-xl border border-sand-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-ink-900">{r.title}</p>
                      <p className="mt-0.5 text-[13px] text-ink-500">{r.site} · {r.category}</p>
                    </div>
                    <Badge tone={r.priority === 'critical' ? 'danger' : r.priority === 'high' ? 'clay' : 'warn'} className="capitalize">
                      {r.priority}
                    </Badge>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-[12px] text-ink-500">
                    <span>Impact <strong className="font-mono text-ink-900">{r.impact}</strong></span>
                    <span>Effort <strong className="text-ink-900">{r.effort}</strong></span>
                    <span>Window <strong className="text-ink-900">{r.window}</strong></span>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader eyebrow="Habitat" title="Degradation detected this month" />
            <CardBody className="space-y-3">
              {degradationAlerts.map((d) => (
                <div key={d.id} className="flex items-start gap-3 rounded-xl bg-sand-50 p-3.5">
                  <AlertTriangle size={16} className={d.severity === 'critical' ? 'mt-0.5 text-red-600' : 'mt-0.5 text-clay-500'} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink-900">{d.site} · {d.change}</p>
                    <p className="mt-0.5 text-[13px] text-ink-500">{d.cause}</p>
                    <p className="mt-1 font-mono text-[11px] text-ink-500">{formatDate(d.detected)}</p>
                  </div>
                </div>
              ))}
              <Link to="/biodiversity">
                <Button variant="secondary" size="sm" className="mt-1">Open habitat view</Button>
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
