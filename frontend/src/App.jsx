import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import { ROLES } from './utils/constants';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/auth/Profile';
import Dashboard from './pages/dashboards/Dashboard';
import MonitoringSites from './pages/MonitoringSites';
import CameraTraps from './pages/CameraTraps';
import Bioacoustics from './pages/Bioacoustics';
import SpeciesExplorer from './pages/SpeciesExplorer';
import PopulationAnalytics from './pages/PopulationAnalytics';
import Biodiversity from './pages/Biodiversity';
import EcosystemHealth from './pages/EcosystemHealth';
import Conservation from './pages/Conservation';
import Reports from './pages/Reports';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import Recommendations from './pages/Recommendations';
/** Sends signed-in users away from the auth screens. */
function PublicOnly({ children }) {
  const { isAuthenticated, booting } = useAuth();
  if (booting) return null;
  return isAuthenticated ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="sites" element={<MonitoringSites />} />
        <Route path="camera-traps" element={<CameraTraps />} />
        <Route path="bioacoustics" element={<Bioacoustics />} />
        <Route path="species" element={<SpeciesExplorer />} />
        <Route path="population" element={<PopulationAnalytics />} />
        <Route path="biodiversity" element={<Biodiversity />} />
        <Route path="ecosystem-health" element={<EcosystemHealth />} />
        <Route path="conservation" element={<Conservation />} />
        <Route path="recommendations" element={<Recommendations />} />
        <Route path="reports" element={<Reports />} />
        <Route
          path="admin"
          element={
            <ProtectedRoute roles={[ROLES.ADMIN]}>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
