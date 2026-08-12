import { Link } from 'react-router-dom';
import { Bird, Camera, Gauge, ListChecks, ArrowRight } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { StatTile } from '../../components/ui/StatTile';
import { IucnBadge, Badge } from '../../components/ui/Badge';
import { Table } from '../../components/ui/Table';
import { populationTrend } from '../../mock/analytics';
import { timeAgo } from '../../utils/format';

const ICONS = { observations: Camera, species: Bird, pending: ListChecks, accuracy: Gauge };

export function ResearcherDashboard({ data }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.tiles.map((t) => (
          <StatTile key={t.key} label={t.label} value={t.value} unit={t.unit} delta={t.delta} icon={ICONS[t.key]} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader
            eyebrow="12-month series"
            title="Population trend by flagship species"
            action={
              <Link to="/population" className="inline-flex items-center gap-1.5 text-sm font-medium text-moss-600 hover:underline">
                Full analytics <ArrowRight size={14} />
              </Link>
            }
          />
          <CardBody>
            <ResponsiveContainer width="100%" height={288}>
              <LineChart data={populationTrend} margin={{ top: 4, right: 8, bottom: 0, left: -18 }}>
                <CartesianGrid stroke="#E7E1D5" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#5B6560' }} tickLine={false} axisLine={{ stroke: '#E7E1D5' }} />
                <YAxis tick={{ fontSize: 11, fill: '#5B6560' }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #E7E1D5', fontSize: 12 }}
                  labelStyle={{ fontWeight: 600, color: '#1A1D1A' }}
                />
                <Line type="monotone" dataKey="elephant" name="Asian Elephant" stroke="#2C7A5B" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="gaur" name="Indian Gaur" stroke="#B4763A" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="tahr" name="Nilgiri Tahr" stroke="#4E9E7A" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="tiger" name="Bengal Tiger" stroke="#8A6742" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink-500">
              {[
                ['#2C7A5B', 'Asian Elephant'], ['#B4763A', 'Indian Gaur'],
                ['#4E9E7A', 'Nilgiri Tahr'], ['#8A6742', 'Bengal Tiger'],
              ].map(([c, l]) => (
                <span key={l} className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: c }} /> {l}
                </span>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader eyebrow="Latest confirmed" title="Recent observations" />
          <Table
            columns={[
              {
                key: 'species', header: 'Species',
                render: (r) => (
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink-900">{r.species}</p>
                    <p className="binomial truncate text-[12px]">{r.binomial}</p>
                  </div>
                ),
              },
              { key: 'iucn', header: 'Status', render: (r) => <IucnBadge code={r.iucn} showLabel={false} /> },
              {
                key: 'at', header: 'Seen', align: 'right',
                render: (r) => (
                  <div>
                    <p className="text-[13px] text-ink-700">{timeAgo(r.at)}</p>
                    <p className="text-[11px] text-ink-500">{r.site}</p>
                  </div>
                ),
              },
            ]}
            rows={data.recentObservations}
          />
        </Card>
      </div>
    </div>
  );
}
