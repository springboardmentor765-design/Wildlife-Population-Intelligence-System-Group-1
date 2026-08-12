import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { EmptyState } from '../ui/States';
import { Lock } from 'lucide-react';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';

export function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user, booting } = useAuth();
  const location = useLocation();

  if (booting) {
    return (
      <div className="grid min-h-screen place-items-center bg-sand-100">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-moss-200 border-t-moss-500" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;

  if (roles && !roles.includes(user.role)) {
    return (
      <EmptyState
        icon={Lock}
        title="This area is limited to administrators"
        message="Your role does not include access to platform administration. Ask a platform administrator if you need it."
        action={
          <Link to="/">
            <Button variant="secondary">Back to dashboard</Button>
          </Link>
        }
      />
    );
  }

  return children;
}
