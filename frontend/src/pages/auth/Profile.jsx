import { useState } from 'react';
import { Check, KeyRound, Save } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Field, Input, Select } from '../../components/ui/Field';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { ROLE_LABELS, ROLES } from '../../utils/constants';
import { formatDate, initials } from '../../utils/format';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '', email: user?.email || '',
    organization: user?.organization || '', designation: user?.designation || '',
    phone: user?.phone || '', region: user?.region || '', role: user?.role,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (k) => (e) => {
    setForm({ ...form, [k]: e.target.value });
    setSaved(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(form);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Your profile"
        description="Details here appear on the reports and survey records you generate."
      />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card>
          <CardBody className="pt-6 text-center">
            <span className="mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-moss-500 font-display text-2xl text-white">
              {initials(user?.name)}
            </span>
            <h2 className="mt-4 font-display text-xl text-ink-900">{user?.name}</h2>
            <p className="text-sm text-ink-500">{user?.email}</p>
            <div className="mt-3 flex justify-center">
              <Badge tone="moss">{ROLE_LABELS[user?.role]}</Badge>
            </div>
            <dl className="mt-6 space-y-3 border-t border-sand-200 pt-5 text-left text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-ink-500">Organisation</dt>
                <dd className="truncate text-ink-900">{user?.organization}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-500">Region</dt>
                <dd className="truncate text-ink-900">{user?.region}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-500">Member since</dt>
                <dd className="text-ink-900">{user?.joined ? formatDate(user.joined) : '—'}</dd>
              </div>
            </dl>
          </CardBody>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader eyebrow="Editable" title="Personal details" />
            <CardBody>
              <form onSubmit={submit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full name"><Input value={form.name} onChange={set('name')} /></Field>
                  <Field label="Email"><Input type="email" value={form.email} onChange={set('email')} /></Field>
                  <Field label="Organisation"><Input value={form.organization} onChange={set('organization')} /></Field>
                  <Field label="Designation"><Input value={form.designation} onChange={set('designation')} /></Field>
                  <Field label="Phone"><Input value={form.phone} onChange={set('phone')} /></Field>
                  <Field label="Primary region"><Input value={form.region} onChange={set('region')} /></Field>
                </div>
                <Field label="Role" hint="Only an administrator can change your role.">
                  <Select value={form.role} disabled>
                    {Object.values(ROLES).map((r) => (
                      <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                    ))}
                  </Select>
                </Field>
                <div className="flex items-center gap-3 pt-2">
                  <Button type="submit" icon={Save} loading={saving}>Save changes</Button>
                  {saved && (
                    <span className="inline-flex items-center gap-1.5 text-sm text-moss-600">
                      <Check size={15} /> Saved
                    </span>
                  )}
                </div>
              </form>
            </CardBody>
          </Card>

          <Card>
            <CardHeader eyebrow="Security" title="Password" description="Change it if you suspect your credentials were shared." />
            <CardBody>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="New password"><Input type="password" placeholder="At least 8 characters" /></Field>
                <Field label="Confirm new password"><Input type="password" /></Field>
              </div>
              <Button variant="secondary" icon={KeyRound} className="mt-4">Update password</Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
