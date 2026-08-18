import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Eye,
  EyeOff,
  Leaf,
  LogIn,
} from 'lucide-react';

import { AuthShell } from './AuthShell';
import { Button } from '../../components/ui/Button';
import { Field, Input } from '../../components/ui/Field';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      await login(form);

      navigate(
        location.state?.from?.pathname || '/',
        { replace: true }
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>

      {/* Logo */}
      <div className="flex justify-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-moss-600 shadow-sm">
          <Leaf size={27} className="text-white" />
        </span>
      </div>


      {/* Heading */}
      <div className="mt-5 text-center">

        <h1 className="font-display text-[27px] leading-tight text-ink-900">
          Wildlife Population
          <br />
          Intelligence System
        </h1>

        <p className="mt-2 text-lg text-ink-700">
          Login to WPIS
        </p>

      </div>


      {/* Error */}
      {error && (
        <div className="mt-6 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">

          <AlertTriangle
            size={16}
            className="mt-0.5 shrink-0 text-red-600"
          />

          <p className="text-sm text-red-800">
            {error}
          </p>

        </div>
      )}


      {/* Form */}
      <form
        onSubmit={submit}
        className="mt-7 space-y-4"
      >

        <Field label="Work Email Address" required>

          <Input
            type="email"
            required
            autoComplete="email"
            placeholder="you@organisation.org"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />

        </Field>


        <Field label="Password" required>

          <div className="relative">

            <Input
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              className="pr-10"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((value) => !value)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700"
              aria-label={
                showPassword
                  ? 'Hide password'
                  : 'Show password'
              }
            >
              {showPassword ? (
                <EyeOff size={17} />
              ) : (
                <Eye size={17} />
              )}
            </button>

          </div>

        </Field>


        {/* Remember / Forgot */}
        <div className="flex items-center justify-between pt-1">

          <label className="flex items-center gap-2 text-sm text-ink-700">

            <input
              type="checkbox"
              className="h-4 w-4 rounded border-sand-300 text-moss-500 focus:ring-moss-300"
            />

            Remember me

          </label>

          <button
            type="button"
            className="text-sm font-medium text-moss-700 hover:underline"
          >
            Forgot password?
          </button>

        </div>


        {/* Login */}
        <Button
          type="submit"
          size="lg"
          icon={LogIn}
          loading={loading}
          className="w-full"
        >
          Login
        </Button>

      </form>


      {/* Register */}
      <p className="mt-6 text-center text-sm text-ink-500">

        Don't have an account?{' '}

        <Link
          to="/register"
          className="font-medium text-moss-700 hover:underline"
        >
          Register
        </Link>

      </p>


      {/* Footer */}
      <div className="mt-7 flex items-center justify-between border-t border-sand-200 pt-4">

        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-400">
          WPIS · v1.0
        </span>

        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-400">

          <span className="h-1.5 w-1.5 rounded-full bg-moss-500" />

          Wildlife monitoring

        </span>

      </div>

    </AuthShell>
  );
}