import { useAuth } from '../../context/AuthContext';
import { useAsync } from '../../hooks/useAsync';
import { dashboardService } from '../../services/dashboardService';
import { adminService } from '../../services/adminService';
import { ROLES, ROLE_LABELS } from '../../utils/constants';

import { PageHeader } from '../../components/layout/PageHeader';
import { SkeletonTiles, SkeletonChart } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/States';

import { ResearcherDashboard } from './ResearcherDashboard';
import { ConservationDashboard } from './ConservationDashboard';
import { ForestDashboard } from './ForestDashboard';
import { AdminDashboard } from './AdminDashboard';

const GREETING = () => {
  const h = new Date().getHours();

  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';

  return 'Good evening';
};

export default function Dashboard() {
  const { user } = useAuth();

  const isAdmin = user.role === ROLES.ADMIN;

  const {
    data,
    loading,
    error,
    reload,
  } = useAsync(
    () =>
      isAdmin
        ? adminService.overview()
        : dashboardService.summary(user.role),
    [user.role]
  );

  const firstName = user.name
    .replace(/^Dr\.\s*/, '')
    .split(' ')[0];

  return (
    <>
      <PageHeader
        eyebrow={ROLE_LABELS[user.role]}
        title={`${GREETING()}, ${firstName}`}
        description={
          isAdmin
            ? 'Platform health, processing volume and the device fleet at a glance.'
            : 'What the field recorded since you were last here.'
        }
      />

      {loading && (
        <div className="space-y-6">
          <SkeletonTiles />

          <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <SkeletonChart className="h-[420px]" />
            <SkeletonChart className="h-[420px]" />
          </div>
        </div>
      )}

      {error && !loading && (
        <ErrorState
          message={error}
          onRetry={reload}
        />
      )}

      {data && !loading && !error && (
        <>
          {user.role === ROLES.RESEARCHER && (
            <ResearcherDashboard data={data} />
          )}

          {user.role === ROLES.CONSERVATION && (
            <ConservationDashboard data={data} />
          )}

          {user.role === ROLES.FOREST && (
            <ForestDashboard data={data} />
          )}

          {isAdmin && (
            <AdminDashboard data={data} />
          )}
        </>
      )}
    </>
  );
}