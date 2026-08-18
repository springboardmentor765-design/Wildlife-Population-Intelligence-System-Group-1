import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import Logo from "../components/Logo";
import GoogleSignIn from "../components/GoogleSignIn";
import { useAuth } from "../context/AuthContext";

const ROLES = [
  { value: "researcher", label: "Wildlife Researcher" },
  { value: "conservation_officer", label: "Conservation Officer" },
  { value: "forest_department", label: "Forest Department" },
  { value: "administrator", label: "Administrator" },
];

export default function Register() {
  const { register, loginWithGoogle } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "researcher",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-6 sm:py-8">
      <div className="glass-card w-full max-w-[460px] rounded-[28px] px-5 py-6 shadow-glow sm:px-8 sm:py-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo size={112} className="ring-2 ring-forest-500/20" />
          <h1 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
            Create <span className="text-forest-500">Account</span>
          </h1>
          <p className="mt-1 text-sm text-zinc-400">Join the wildlife intelligence network.</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <Field icon={User} label="Full name">
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
              className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500"
            />
          </Field>
          <Field icon={Mail} label="Email Address">
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Enter your email"
              className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500"
            />
          </Field>
          <Field icon={Lock} label="Password">
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Create a password"
              className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500"
            />
          </Field>
          <label className="block">
            <span className="mb-1.5 block text-sm text-zinc-300">Role</span>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/35 px-3 py-3 text-sm text-white outline-none"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value} className="bg-[#101a14]">
                  {r.label}
                </option>
              ))}
            </select>
          </label>
          {error && <p className="text-center text-sm text-red-400">{error}</p>}
          <button
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-forest-500 py-3 text-sm font-semibold text-white hover:bg-forest-400 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Sign Up"} <ArrowRight size={16} />
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
              await loginWithGoogle(credential, form.role);
            } catch (err) {
              setError(err.response?.data?.detail || "Google sign-in failed");
            } finally {
              setLoading(false);
            }
          }}
        />
        <p className="mt-6 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-forest-400 underline underline-offset-2">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-zinc-300">{label}</span>
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-3 py-3">
        <Icon size={16} className="text-zinc-500" />
        {children}
      </div>
    </label>
  );
}
