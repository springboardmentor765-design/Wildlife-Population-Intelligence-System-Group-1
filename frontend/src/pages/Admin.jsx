import { useState } from 'react';
import { Search, ShieldCheck, UserCog, Users } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader } from '../components/ui/Card';
import { Table } from '../components/ui/Table';
import { StatTile } from '../components/ui/StatTile';
import { Badge, StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Field';
import { SkeletonTable, SkeletonTiles } from '../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../components/ui/States';
import { useAsync, useDebounced } from '../hooks/useAsync';
import { adminService } from '../services/adminService';
import { ROLES, ROLE_LABELS } from '../utils/constants';
import { formatNumber, timeAgo } from '../utils/format';

export default function Admin() {
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('');
  const debounced = useDebounced(query);

  const overview = useAsync(() => adminService.overview(), []);
  const users = useAsync(
    () => adminService.users({ q: debounced, role: role || undefined }),
    [debounced, role]
  );

  const toggleStatus = async (u) => {
    await adminService.updateUser(u.id, { status: u.status === 'suspended' ? 'active' : 'suspended' });
    users.reload();
  };

  const changeRole = async (u, next) => {
    await adminService.updateUser(u.id, { role: next });
    users.reload();
  };

  return (
    <>
      <PageHeader
        eyebrow="Operations"
        title="Administration"
        description="Accounts, roles and the health of the platform behind them."
      />

      {overview.loading && <SkeletonTiles />}
      {overview.error && !overview.loading && (
        <ErrorState message={overview.error} onRetry={overview.reload} />
      )}
      {overview.data && !overview.loading && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatTile label="Registered users" value={overview.data.stats.users} icon={Users} />
          <StatTile label="Devices online" value={overview.data.stats.devicesOnline} unit={`/ ${overview.data.stats.devices}`} icon={ShieldCheck} tone="clay" />
          <StatTile
            label="API calls, last 24h"
            value={formatNumber(overview.data.stats.apiCalls24h)}
            icon={UserCog}
            hint={`${overview.data.stats.avgImageLatencyMs} ms image · ${overview.data.stats.avgAudioLatencyMs} ms audio`}
          />
          <StatTile label="Uptime, 30 days" value={overview.data.stats.uptime} unit="%" icon={ShieldCheck} />
        </div>
      )}

      <Card className="mt-6">
        <CardHeader eyebrow="Access control" title="User management" description="Role changes take effect the next time the user signs in." />

        <div className="flex flex-col gap-3 border-y border-sand-200 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name or email"
              className="w-full rounded-lg border border-sand-200 bg-sand-50 py-2 pl-9 pr-3 text-sm focus:border-moss-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-moss-100"
            />
          </div>
          <Select value={role} onChange={(e) => setRole(e.target.value)} className="sm:w-64">
            <option value="">All roles</option>
            {Object.values(ROLES).map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
          </Select>
        </div>

        {users.loading && <SkeletonTable rows={6} cols={5} />}
        {users.error && !users.loading && <ErrorState message={users.error} onRetry={users.reload} />}

        {!users.loading && !users.error && (
          <Table
            columns={[
              {
                key: 'name', header: 'User',
                render: (u) => (
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink-900">{u.name}</p>
                    <p className="truncate font-mono text-[12px] text-ink-500">{u.email}</p>
                  </div>
                ),
              },
              { key: 'org', header: 'Organisation', render: (u) => <Badge>{u.org}</Badge> },
              {
                key: 'role', header: 'Role',
                render: (u) => (
                  <Select
                    value={u.role}
                    onChange={(e) => changeRole(u, e.target.value)}
                    className="py-1.5 text-[13px]"
                  >
                    {Object.values(ROLES).map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                  </Select>
                ),
              },
              {
                key: 'lastActive', header: 'Last active',
                render: (u) => (u.lastActive ? timeAgo(u.lastActive) : <span className="text-ink-500">Never signed in</span>),
              },
              { key: 'status', header: 'Status', render: (u) => <StatusBadge status={u.status} /> },
              {
                key: 'actions', header: '', align: 'right',
                render: (u) => (
                  <Button
                    size="sm"
                    variant={u.status === 'suspended' ? 'secondary' : 'ghost'}
                    onClick={() => toggleStatus(u)}
                  >
                    {u.status === 'suspended' ? 'Restore access' : 'Suspend'}
                  </Button>
                ),
              },
            ]}
            rows={users.data}
            empty={
              <EmptyState
                icon={Users}
                title="No users match that search"
                message="Clear the search box or pick a different role to widen the list."
              />
            }
          />
        )}
      </Card>
    </>
  );
}
