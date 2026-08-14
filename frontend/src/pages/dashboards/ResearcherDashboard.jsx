import { Bird, Camera, Gauge, ListChecks } from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { StatTile } from '../../components/ui/StatTile';
import { IucnBadge, Badge } from '../../components/ui/Badge';
import { Table } from '../../components/ui/Table';
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
      <Card>
  <CardHeader eyebrow="Latest confirmed" title="Recent observations" />
  <Table
    columns={[
      {
        key: 'species',
        header: 'Species',
        render: (r) => (
          <div className="min-w-0">
            <p className="truncate font-medium text-ink-900">
              {r.species}
            </p>
            <p className="binomial truncate text-[12px]">
              {r.binomial}
            </p>
          </div>
        ),
      },
      {
        key: 'iucn',
        header: 'Status',
        render: (r) => (
          <IucnBadge code={r.iucn} showLabel={false} />
        ),
      },
      {
        key: 'at',
        header: 'Seen',
        align: 'right',
        render: (r) => (
          <div>
            <p className="text-[13px] text-ink-700">
                {timeAgo(r.at)}
            </p>
            <p className="text-[11px] text-ink-500">
              {r.site}
            </p>
          </div>
        ),
      },
    ]}
    rows={data.recentObservations}
  />
</Card>
      
    </div>
  );
}
