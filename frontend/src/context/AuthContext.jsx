import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';
import { ROLES } from '../utils/constants';

const AuthContext = createContext(null);

/*
 * Maps roles issued by older builds / mock accounts onto the
 * canonical backend role values used today.
 */
const LEGACY_ROLES = {
  admin: ROLES.ADMIN,
  forest_officer: ROLES.FOREST,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const token = authService.getToken();
    const stored = authService.getStoredUser();
    if (token && stored) {
      setUser({
        ...stored,
        role: LEGACY_ROLES[stored.role] ?? stored.role,
      });
    }
    setBooting(false);
  }, []);

  const value = useMemo(
    () => ({
      user,
      booting,
      isAuthenticated: Boolean(user),
      async login(credentials) {
        const { user: u } = await authService.login(credentials);
        setUser(u);
        return u;
      },
      async register(payload) {
        const { user: u } = await authService.register(payload);
        setUser(u);
        return u;
      },
      async updateProfile(patch) {
        const u = await authService.updateProfile(patch);
        setUser(u);
        return u;
      },
      logout() {
        authService.logout();
        setUser(null);
      },
    }),
    [user, booting]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
