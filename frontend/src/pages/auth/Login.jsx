import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, LogIn } from 'lucide-react';
import { AuthShell } from './AuthShell';
import { Button } from '../../components/ui/Button';
import { Field, Input } from '../../components/ui/Field';
import { useAuth } from '../../context/AuthContext';
import { demoAccounts } from '../../mock/users';
import { ROLE_LABELS } from '../../utils/constants';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <p className="eyebrow">Sign in</p>
      <h1 className="mt-2 font-display text-[30px] leading-tight text-ink-900">
        Pick up where the field left off
      </h1>
      <p className="mt-2 text-sm text-ink-500">
        Use your platform credentials. Your role decides which dashboard opens first.
      </p>

      {error && (
        <div className="mt-6 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-red-600" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={submit} className="mt-6 space-y-4">
        <Field label="Work email" required>
          <Input
            type="email" required autoComplete="email"
            placeholder="you@organisation.org"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </Field>
        <Field label="Password" required>
          <Input
            type="password" required autoComplete="current-password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </Field>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input type="checkbox" className="h-4 w-4 rounded border-sand-300 text-moss-500 focus:ring-moss-300" />
            Keep me signed in
          </label>
          <button type="button" className="text-sm font-medium text-moss-600 hover:underline">
            Reset password
          </button>
        </div>

        <Button type="submit" size="lg" icon={LogIn} loading={loading} className="w-full">
          Sign in
        </Button>
      </form>

      <div className="mt-8 rounded-xl border border-sand-200 bg-white p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-500">
          Demo accounts · any password
        </p>
        <div className="mt-3 grid gap-1.5">
          {demoAccounts.map((a) => (
            <button
              key={a.email}
              type="button"
              onClick={() => setForm({ email: a.email, password: 'demo1234' })}
              className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-sand-50"
            >
              <span className="truncate text-ink-700">{ROLE_LABELS[a.role]}</span>
              <span className="shrink-0 font-mono text-[11px] text-ink-500">{a.email}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-ink-500">
        No account yet?{' '}
        <Link to="/register" className="font-medium text-moss-600 hover:underline">
          Request access
        </Link>
      </p>
    </AuthShell>
  );
}
