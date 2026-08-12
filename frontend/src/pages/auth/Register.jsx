import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, UserPlus } from 'lucide-react';
import { AuthShell } from './AuthShell';
import { Button } from '../../components/ui/Button';
import { Field, Input, Select } from '../../components/ui/Field';
import { useAuth } from '../../context/AuthContext';
import { ROLES, ROLE_LABELS } from '../../utils/constants';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', organization: '', phone: '',
    role: ROLES.RESEARCHER, password: '', confirm: '',
  });
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Enter your full name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (form.password.length < 8) next.password = 'Use at least 8 characters.';
    if (form.password !== form.confirm) next.confirm = 'Passwords do not match.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setBanner('');
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form);
      navigate('/', { replace: true });
    } catch (err) {
      setBanner(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <p className="eyebrow">Request access</p>
      <h1 className="mt-2 font-display text-[30px] leading-tight text-ink-900">
        Join the monitoring network
      </h1>
      <p className="mt-2 text-sm text-ink-500">
        Forest department and conservation roles are verified by an administrator before survey data
        is released.
      </p>

      {banner && (
        <div className="mt-6 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-red-600" />
          <p className="text-sm text-red-800">{banner}</p>
        </div>
      )}

      <form onSubmit={submit} className="mt-6 space-y-4">
        <Field label="Full name" required error={errors.name}>
          <Input value={form.name} onChange={set('name')} placeholder="Dr. Anitha Raghavan" invalid={!!errors.name} />
        </Field>
        <Field label="Work email" required error={errors.email}>
          <Input type="email" value={form.email} onChange={set('email')} placeholder="you@organisation.org" invalid={!!errors.email} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Organisation">
            <Input value={form.organization} onChange={set('organization')} placeholder="Forest department, NGO or institute" />
          </Field>
          <Field label="Phone">
            <Input value={form.phone} onChange={set('phone')} placeholder="+91 " />
          </Field>
        </div>
        <Field label="Role" hint="Determines the dashboard and data you see.">
          <Select value={form.role} onChange={set('role')}>
            {Object.values(ROLES).map((r) => (
              <option key={r} value={r}>{ROLE_LABELS[r]}</option>
            ))}
          </Select>
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Password" required error={errors.password}>
            <Input type="password" value={form.password} onChange={set('password')} invalid={!!errors.password} />
          </Field>
          <Field label="Confirm password" required error={errors.confirm}>
            <Input type="password" value={form.confirm} onChange={set('confirm')} invalid={!!errors.confirm} />
          </Field>
        </div>

        <Button type="submit" size="lg" icon={UserPlus} loading={loading} className="w-full">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Already registered?{' '}
        <Link to="/login" className="font-medium text-moss-600 hover:underline">Sign in</Link>
      </p>
    </AuthShell>
  );
}
