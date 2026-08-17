import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("wlp_token");
    const cached = localStorage.getItem("wlp_user");
    if (cached) {
      try {
        setUser(JSON.parse(cached));
      } catch {
        localStorage.removeItem("wlp_user");
      }
    }
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("wlp_user", JSON.stringify(res.data));
      })
      .catch(() => {
        localStorage.removeItem("wlp_token");
        localStorage.removeItem("wlp_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const applyAuth = (data) => {
    localStorage.setItem("wlp_token", data.access_token);
    localStorage.setItem("wlp_user", JSON.stringify(data.user));
    setUser(data.user);
    navigate("/dashboard", { replace: true });
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    applyAuth(data);
    return data.user;
  };

  const quickLogin = async (role) => {
    const { data } = await api.post(`/auth/quick-login/${role}`);
    applyAuth(data);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    applyAuth(data);
    return data.user;
  };

  const loginWithGoogle = async (credential, role = "researcher") => {
    const { data } = await api.post("/auth/google", { credential, role });
    applyAuth(data);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("wlp_token");
    localStorage.removeItem("wlp_user");
    setUser(null);
    navigate("/", { replace: true });
  };

  const updateUser = (next) => {
    setUser(next);
    localStorage.setItem("wlp_user", JSON.stringify(next));
  };

  const value = useMemo(
    () => ({ user, loading, login, quickLogin, register, loginWithGoogle, logout, updateUser }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { ROLE_LABELS } from "../auth/access";
