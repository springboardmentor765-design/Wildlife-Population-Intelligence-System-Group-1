import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import {
  Bar, BarChart, CartesianGrid, Legend, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { Compass, Ruler, Sprout, Users } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { StatTile } from '../components/ui/StatTile';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { SkeletonChart, SkeletonTiles } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/States';
import { useAsync } from '../hooks/useAsync';
import { analyticsService } from '../services/analyticsService';
import { formatCoords, formatNumber } from '../utils/format';

const MARKER_COLOR = { active: '#2C7A5B', maintenance: '#C4854C', offline: '#D81E05' };

export default function PopulationAnalytics() {
  const { data, loading, error, reload } = useAsync(() => analyticsService.population(), []);

  // Leaflet needs a resize nudge when it mounts inside a freshly laid-out grid.
  useEffect(() => {
    if (!loading) window.dispatchEvent(new Event('resize'));
  }, [loading]);

  return (
    <>
      <PageHeader
        eyebrow="Intelligence"
        title="Population analytics"
        description="Counts, density and distribution across the monitoring network over the last 12 months."
      />

      {loading && (
        <div className="space-y-6">
          <SkeletonTiles />
          <SkeletonChart className="h-96" />
          <div className="grid gap-6 lg:grid-cols-2">
            <SkeletonChart className="h-80" />
            <SkeletonChart className="h-80" />
          </div>
        </div>
      )}

      {error && !loading && <ErrorState message={error} onRetry={reload} />}

      {data && !loading && !error && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatTile label="Individuals estimated" value={data.summary.totalPopulation} icon={Users} delta={data.summary.growthRate} />
            <StatTile label="Species richness" value={data.summary.speciesRichness} icon={Sprout} delta={5.6} />
            <StatTile label="Mean density" value={data.summary.densityPerSqKm} unit="/ km²" icon={Compass} tone="clay" />
            <StatTile label="Area surveyed" value={data.summary.surveyedArea} unit="km²" icon={Ruler} tone="bark" />
          </div>

          <Card>
            <CardHeader
              eyebrow="Monthly estimates"
              title="Population trend over time"
              description="Estimates combine camera trap capture rates with transect counts."
            />
            <CardBody>
              <ResponsiveContainer width="100%" height={340}>
                <LineChart data={data.trend} margin={{ top: 8, right: 12, bottom: 0, left: -14 }}>
                  <CartesianGrid stroke="#E7E1D5" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#5B6560' }} tickLine={false} axisLine={{ stroke: '#E7E1D5' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#5B6560' }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E7E1D5', fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                  <Line type="monotone" dataKey="elephant" name="Asian Elephant" stroke="#2C7A5B" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                  <Line type="monotone" dataKey="gaur" name="Indian Gaur" stroke="#B4763A" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                  <Line type="monotone" dataKey="tahr" name="Nilgiri Tahr" stroke="#4E9E7A" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                  <Line type="monotone" dataKey="tiger" name="Bengal Tiger" stroke="#8A6742" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader eyebrow="By site" title="Species richness" description="Distinct species confirmed, and how many are Western Ghats endemics." />
              <CardBody>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.richness} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                    <CartesianGrid stroke="#E7E1D5" vertical={false} />
                    <XAxis dataKey="site" tick={{ fontSize: 11, fill: '#5B6560' }} tickLine={false} axisLine={{ stroke: '#E7E1D5' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#5B6560' }} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: '#F3EFE7' }} contentStyle={{ borderRadius: 12, border: '1px solid #E7E1D5', fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                    <Bar dataKey="richness" name="Species" fill="#2C7A5B" radius={[6, 6, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="endemic" name="Endemic" fill="#B4763A" radius={[6, 6, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>

            <Card>
              <CardHeader eyebrow="Distribution" title="Where the animals are" description="Marker size follows estimated density; colour follows device status." />
              <CardBody>
                <div className="h-[300px] overflow-hidden rounded-xl">
                  <MapContainer center={[10.9, 76.8]} zoom={8} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {data.markers.map((m) => (
                      <CircleMarker
                        key={m.id}
                        center={[m.lat, m.lng]}
                        radius={6 + m.density * 1.8}
                        pathOptions={{
                          color: MARKER_COLOR[m.status], fillColor: MARKER_COLOR[m.status],
                          fillOpacity: 0.35, weight: 2,
                        }}
                      >
                        <Popup>
                          <div className="text-[13px]">
                            <p className="font-semibold">{m.name}</p>
                            <p className="italic">{m.dominant}</p>
                            <p className="mt-1">{formatNumber(m.population)} detections · {m.density}/km²</p>
                            <p className="text-[11px] text-gray-500">{formatCoords(m.lat, m.lng)}</p>
                          </div>
                        </Popup>
                      </CircleMarker>
                    ))}
                  </MapContainer>
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-[12px] text-ink-500">
                  {Object.entries(MARKER_COLOR).map(([k, c]) => (
                    <span key={k} className="inline-flex items-center gap-1.5 capitalize">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: c }} /> {k}
                    </span>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          <Card>
            <CardHeader eyebrow="Movement" title="Migration corridors under watch" />
            <Table
              columns={[
                { key: 'name', header: 'Corridor', render: (r) => <span className="font-medium text-ink-900">{r.name}</span> },
                { key: 'species', header: 'Primary species' },
                { key: 'movement', header: 'Movement pattern' },
                { key: 'width', header: 'Effective width' },
                {
                  key: 'pressure', header: 'Pressure', align: 'right',
                  render: (r) => (
                    <Badge tone={r.pressure === 'High' ? 'danger' : r.pressure === 'Moderate' ? 'warn' : 'moss'}>
                      {r.pressure}
                    </Badge>
                  ),
                },
              ]}
              rows={data.corridors}
            />
          </Card>
        </div>
      )}
    </>
  );
}
