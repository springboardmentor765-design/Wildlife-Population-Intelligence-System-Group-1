import { Link } from 'react-router-dom';
import { Activity, Cpu, HardDrive, Users } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { StatTile } from '../../components/ui/StatTile';
import { Table } from '../../components/ui/Table';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatNumber } from '../../utils/format';

export function AdminDashboard({ data }) {
  const s = data.stats;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Registered users" value={s.users} icon={Users} hint={`${s.activeSurveys} active surveys`} />
        <StatTile label="Devices online" value={s.devicesOnline} unit={`/ ${s.devices}`} icon={Cpu} tone="clay" hint="7 need attention" />
        <StatTile label="Images processed" value={s.imagesProcessed} icon={Activity} hint={`${s.avgImageLatencyMs} ms mean inference`} />
        <StatTile label="Storage used" value={s.storageUsedTb} unit="TB" icon={HardDrive} hint={`${s.uptime}% uptime, 30 days`} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader eyebrow="Last 7 days" title="Processing volume" description="Camera trap frames and hours of audio through the inference pipeline." />
          <CardBody>
            <ResponsiveContainer width="100%" height={288}>
              <AreaChart data={data.usage} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                <defs>
                  <linearGradient id="imgFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2C7A5B" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#2C7A5B" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="audFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#B4763A" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#B4763A" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E7E1D5" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#5B6560' }} tickLine={false} axisLine={{ stroke: '#E7E1D5' }} />
                <YAxis tick={{ fontSize: 11, fill: '#5B6560' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E7E1D5', fontSize: 12 }} />
                <Area type="monotone" dataKey="images" name="Images" stroke="#2C7A5B" strokeWidth={2} fill="url(#imgFill)" />
                <Area type="monotone" dataKey="audio" name="Audio clips" stroke="#B4763A" strokeWidth={2} fill="url(#audFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            eyebrow="Fleet"
            title="Monitoring devices"
            action={<Link to="/admin"><Button size="sm" variant="secondary">Manage</Button></Link>}
          />
          <Table
            columns={[
              {
                key: 'id', header: 'Device',
                render: (r) => (
                  <div>
                    <p className="font-mono text-[13px] font-medium text-ink-900">{r.id}</p>
                    <p className="text-[12px] text-ink-500">{r.site}</p>
                  </div>
                ),
              },
              {
                key: 'battery', header: 'Battery',
                render: (r) => (
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-14 overflow-hidden rounded-full bg-sand-200">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${r.battery}%`, background: r.battery < 20 ? '#D81E05' : r.battery < 50 ? '#C4854C' : '#2C7A5B' }}
                      />
                    </div>
                    <span className="font-mono text-[12px]">{r.battery}%</span>
                  </div>
                ),
              },
              { key: 'status', header: 'Status', align: 'right', render: (r) => <StatusBadge status={r.status} /> },
            ]}
            rows={data.devices}
          />
          <div className="border-t border-sand-200 px-5 py-3.5">
            <p className="text-[13px] text-ink-500">
              API calls in the last 24 hours: <span className="font-mono text-ink-900">{formatNumber(s.apiCalls24h)}</span>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
