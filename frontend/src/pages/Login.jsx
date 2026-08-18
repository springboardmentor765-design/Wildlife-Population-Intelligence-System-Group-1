import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, Shield, Trees, Settings, ArrowRight } from "lucide-react";
import Logo from "../components/Logo";
import GoogleSignIn from "../components/GoogleSignIn";
import { useAuth } from "../context/AuthContext";

const ROLES = [
  { role: "researcher", label: "Researcher", icon: User, color: "text-violet-400 border-violet-400/40 hover:bg-violet-500/10" },
  { role: "conservation_officer", label: "Conservation Officer", icon: Shield, color: "text-sky-400 border-sky-400/40 hover:bg-sky-500/10" },
  { role: "forest_department", label: "Forest Department", icon: Trees, color: "text-forest-400 border-forest-400/40 hover:bg-forest-500/10" },
  { role: "administrator", label: "Administrator", icon: Settings, color: "text-orange-400 border-orange-400/40 hover:bg-orange-500/10" },
];

export default function Login() {
  const { login, quickLogin, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.detail || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const onQuick = async (role) => {
    setError("");
    setLoading(true);
    try {
      await quickLogin(role);
    } catch (err) {
      setError(err.response?.data?.detail || "Quick login failed. Did you seed the database?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-6 sm:py-8">
      <div className="glass-card w-full max-w-[460px] rounded-[28px] px-5 py-6 shadow-glow sm:px-8 sm:py-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo size={120} className="ring-2 ring-forest-500/20" />
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Welcome <span className="text-forest-500">Back</span>
          </h1>
          <p className="mt-1 text-sm text-zinc-400">Sign in to access the system.</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm text-zinc-300">Email Address</span>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-3 py-3">
              <Mail size={16} className="text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
              />
            </div>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm text-zinc-300">Password</span>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-3 py-3">
              <Lock size={16} className="text-zinc-500" />
              <input
                type={show ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
              />
              <button type="button" onClick={() => setShow((v) => !v)} className="text-zinc-500 hover:text-white">
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          {error && <p className="text-center text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-forest-500 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-forest-400 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-widest text-zinc-500">
          <span className="h-px flex-1 bg-white/10" />
          OR
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <GoogleSignIn
          disabled={loading}
          onCredential={async (credential) => {
            setError("");
            setLoading(true);
            try {
              await loginWithGoogle(credential);
            } catch (err) {
              setError(err.response?.data?.detail || "Google sign-in failed");
            } finally {
              setLoading(false);
            }
          }}
        />

        <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-widest text-zinc-500">
          <span className="h-px flex-1 bg-white/10" />
          OR
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <p className="mb-3 text-center text-sm text-zinc-400">Quick Login (Click any role)</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {ROLES.map(({ role, label, icon: Icon, color }) => (
            <button
              key={role}
              type="button"
              disabled={loading}
              onClick={() => onQuick(role)}
              className={`flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border bg-black/20 px-1 text-center text-[11px] leading-tight ${color}`}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-medium text-forest-400 underline underline-offset-2">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
