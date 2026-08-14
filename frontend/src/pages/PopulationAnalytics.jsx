import {
  Bar, BarChart, CartesianGrid, Legend, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { Compass, Ruler, Sprout, Users } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { StatTile } from '../components/ui/StatTile';
import { SkeletonChart, SkeletonTiles } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/States';
import { useAsync } from '../hooks/useAsync';
import { analyticsService } from '../services/analyticsService';


export default function PopulationAnalytics() {
  const { data, loading, error, reload } = useAsync(() => analyticsService.population(), []);

  return (
    <>
      <PageHeader
        eyebrow="Intelligence"
        title="Population analytics"
        description="Wildlife population and detection activity from image and audio analysis."
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
            <StatTile label="Total Observations" value={data.summary.totalObservations} icon={Users} />
            <StatTile label="Species detected" value={data.summary.speciesRichness} icon={Sprout} />
            <StatTile label="Population" value={data.summary.population} icon={Compass} tone="clay" />
            <StatTile label="Avg. confidence" value={`${data.summary.averageConfidence}%`} icon={Ruler} tone="bark" />
          </div>

          <Card>
  <CardHeader
    eyebrow="Detection activity"
    title="Wildlife detections over time"
    description="Animals detected through image and audio analysis."
  />
  <CardBody>
    <ResponsiveContainer width="100%" height={340}>
      <LineChart
        data={data.trend}
        margin={{ top: 8, right: 12, bottom: 0, left: -14 }}
      >
        <CartesianGrid stroke="#E7E1D5" vertical={false} />

        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: '#5B6560' }}
          tickLine={false}
          axisLine={{ stroke: '#E7E1D5' }}
        />

        <YAxis
          tick={{ fontSize: 11, fill: '#5B6560' }}
          tickLine={false}
          axisLine={false}
        />

        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: '1px solid #E7E1D5',
            fontSize: 12,
          }}
        />

        <Legend
          wrapperStyle={{
            fontSize: 12,
            paddingTop: 8,
          }}
        />

        <Line
          type="monotone"
          dataKey="imageDetections"
          name="Image detections"
          stroke="#2C7A5B"
          strokeWidth={2.5}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />

        <Line
          type="monotone"
          dataKey="audioDetections"
          name="Audio detections"
          stroke="#B4763A"
          strokeWidth={2.5}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </CardBody>
</Card>
              <Card>
              <CardHeader eyebrow="By species" title="Population by species" description="Number of identified individual animals recorded for each species." />
              <CardBody>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.richness} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                    <CartesianGrid stroke="#E7E1D5" vertical={false} />
                    <XAxis dataKey="site" tick={{ fontSize: 11, fill: '#5B6560' }} tickLine={false} axisLine={{ stroke: '#E7E1D5' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#5B6560' }} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: '#F3EFE7' }} contentStyle={{ borderRadius: 12, border: '1px solid #E7E1D5', fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                    <Bar dataKey="richness" name="Population" fill="#2C7A5B" radius={[6, 6, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>

        </div>
      )}
    </>
  );
}
