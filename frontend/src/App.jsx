import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { canAccess } from "./auth/access";
import AppShell from "./components/AppShell";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Surveys from "./pages/Surveys";
import ImageAnalysis from "./pages/ImageAnalysis";
import AudioAnalysis from "./pages/AudioAnalysis";
import Species from "./pages/Species";
import Population from "./pages/Population";
import Biodiversity from "./pages/Biodiversity";
import Habitat from "./pages/Habitat";
import Conservation from "./pages/Conservation";
import Health from "./pages/Health";
import Reports from "./pages/Reports";
import MapViewer from "./pages/MapViewer";
import AdminUsers from "./pages/AdminUsers";
import Profile from "./pages/Profile";
import Logo from "./components/Logo";

function Guard({ path, children }) {
  const { user } = useAuth();
  if (!canAccess(user?.role, path)) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="jungle-bg flex h-dvh items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Logo size={56} />
          <p className="text-sm text-zinc-300">Loading Wildlife Intelligence…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="jungle-bg min-h-dvh overflow-x-hidden overflow-y-auto">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    );
  }

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Navigate to="/dashboard" replace />} />
        <Route path="/register" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/surveys" element={<Guard path="/surveys"><Surveys /></Guard>} />
        <Route path="/image-analysis" element={<Guard path="/image-analysis"><ImageAnalysis /></Guard>} />
        <Route path="/audio-analysis" element={<Guard path="/audio-analysis"><AudioAnalysis /></Guard>} />
        <Route path="/species" element={<Guard path="/species"><Species /></Guard>} />
        <Route path="/population" element={<Guard path="/population"><Population /></Guard>} />
        <Route path="/biodiversity" element={<Guard path="/biodiversity"><Biodiversity /></Guard>} />
        <Route path="/habitat" element={<Guard path="/habitat"><Habitat /></Guard>} />
        <Route path="/conservation" element={<Guard path="/conservation"><Conservation /></Guard>} />
        <Route path="/health" element={<Guard path="/health"><Health /></Guard>} />
        <Route path="/reports" element={<Guard path="/reports"><Reports /></Guard>} />
        <Route path="/map" element={<Guard path="/map"><MapViewer /></Guard>} />
        <Route path="/users" element={<Guard path="/users"><AdminUsers /></Guard>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppShell>
  );
}
