import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Footprints, MapPinned, ShieldAlert, Radio } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { StatTile } from '../../components/ui/StatTile';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { formatDateTime } from '../../utils/format';

const ICONS = { area: MapPinned, patrols: Footprints, incidents: ShieldAlert, devices: Radio };

const statusTone = {
  'Response dispatched': 'warn', 'Under investigation': 'info', Closed: 'moss', Open: 'danger',
};

export function ForestDashboard({ data }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.tiles.map((t) => (
          <StatTile
            key={t.key} label={t.label} value={t.value} unit={t.unit} delta={t.delta}
            icon={ICONS[t.key]} tone={t.key === 'incidents' ? 'clay' : 'moss'}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader eyebrow="Field log" title="Incidents reported" description="Every entry links to a patrol record and the capture that triggered it." />
          <Table
            columns={[
              {
                key: 'type', header: 'Incident',
                render: (r) => (
                  <div className="min-w-0">
                    <p className="font-medium text-ink-900">{r.type}</p>
                    <p className="truncate text-[12px] text-ink-500">{r.location}</p>
                  </div>
                ),
              },
              { key: 'species', header: 'Species', render: (r) => r.species ?? <span className="text-ink-500">—</span> },
              { key: 'reported', header: 'Reported', render: (r) => <span className="font-mono text-[12px]">{formatDateTime(r.reported)}</span> },
              {
                key: 'status', header: 'Status', align: 'right',
                render: (r) => <Badge tone={statusTone[r.status] ?? 'neutral'}>{r.status}</Badge>,
              },
            ]}
            rows={data.incidents}
          />
        </Card>

        <Card>
          <CardHeader eyebrow="This week" title="Patrol coverage by zone" description="Percentage of planned beat length walked." />
          <CardBody>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.patrolCoverage} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                <CartesianGrid stroke="#E7E1D5" vertical={false} />
                <XAxis dataKey="zone" tick={{ fontSize: 11, fill: '#5B6560' }} tickLine={false} axisLine={{ stroke: '#E7E1D5' }} />
                <YAxis unit="%" tick={{ fontSize: 11, fill: '#5B6560' }} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: '#F3EFE7' }} contentStyle={{ borderRadius: 12, border: '1px solid #E7E1D5', fontSize: 12 }} formatter={(v) => `${v}%`} />
                <Bar dataKey="covered" name="Covered" fill="#2C7A5B" radius={[6, 6, 0, 0]} maxBarSize={54} />
              </BarChart>
            </ResponsiveContainer>
            <p className="mt-2 text-[13px] text-ink-500">
              West zone is the weakest link — 47% coverage against three open elephant incidents.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
