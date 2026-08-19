import { useState } from 'react';
import { MapPin, Plus, Search, Trash2 } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Field, Input, Select } from '../components/ui/Field';
import { StatusBadge, Badge } from '../components/ui/Badge';
import { SkeletonTable } from '../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../components/ui/States';
import { useAsync, useDebounced } from '../hooks/useAsync';
import { siteService } from '../services/siteService';
import { HABITAT_TYPES, DEVICE_TYPES } from '../utils/constants';
import { formatCoords, formatDate, formatNumber, timeAgo } from '../utils/format';

const blankSite = {
  surveyId: '', location: '', lat: '', lng: '',
  habitatType: HABITAT_TYPES[0], surveyDate: '', deviceType: DEVICE_TYPES[0],
  protectedArea: '', deviceId: '',
};

export default function MonitoringSites() {
  const [query, setQuery] = useState('');
  const [habitat, setHabitat] = useState('');
  const debounced = useDebounced(query);
  const { data: sites, loading, error, reload } = useAsync(
    () => siteService.list({ q: debounced, habitatType: habitat || undefined }),
    [debounced, habitat]
  );

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(blankSite);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const validate = () => {
    const next = {};
    if (!/^[A-Z]{3}-\d{4}-\d{3}$/.test(form.surveyId.trim()))
      next.surveyId = 'Use the format ABC-2026-001.';
    if (!form.location.trim()) next.location = 'Name the monitoring location.';
    if (Number.isNaN(Number(form.lat)) || form.lat === '' || Math.abs(Number(form.lat)) > 90)
      next.lat = 'Latitude must be between −90 and 90.';
    if (Number.isNaN(Number(form.lng)) || form.lng === '' || Math.abs(Number(form.lng)) > 180)
      next.lng = 'Longitude must be between −180 and 180.';
    if (!form.surveyDate) next.surveyDate = 'Pick the survey date.';
    setErrors(next);
    return !Object.keys(next).length;
  };

  const save = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await siteService.create(form);
      setOpen(false);
      setForm(blankSite);
      setErrors({});
      reload();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    await siteService.remove(id);
    reload();
  };

  const columns = [
    {
      key: 'surveyId', header: 'Survey',
      render: (r) => (
        <div className="min-w-0">
          <p className="font-mono text-[13px] font-medium text-ink-900">{r.surveyId}</p>
          <p className="truncate text-[12px] text-ink-500">{r.location}</p>
        </div>
      ),
    },
    {
      key: 'coords', header: 'Coordinates',
      render: (r) => <span className="font-mono text-[12px] text-ink-700">{formatCoords(r.lat, r.lng)}</span>,
    },
    { key: 'habitatType', header: 'Habitat', render: (r) => <Badge>{r.habitatType}</Badge> },
    {
      key: 'deviceType', header: 'Device',
      render: (r) => (
        <div>
          <p className="text-[13px] text-ink-900">{r.deviceType}</p>
          <p className="font-mono text-[11px] text-ink-500">{r.deviceId}</p>
        </div>
      ),
    },
    { key: 'protectedArea', header: 'Protected area' },
    { key: 'surveyDate', header: 'Surveyed', render: (r) => formatDate(r.surveyDate) },
    {
      key: 'detections', header: 'Detections', align: 'right',
      render: (r) => <span className="font-mono text-ink-900">{formatNumber(r.detections)}</span>,
    },
    {
      key: 'status', header: 'Status', align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-3">
          <div className="text-right">
            <StatusBadge status={r.status} />
            <p className="mt-1 text-[11px] text-ink-500">synced {timeAgo(r.lastSync)}</p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); remove(r.id); }}
            className="rounded-lg p-1.5 text-ink-500 hover:bg-red-50 hover:text-red-600"
            aria-label={`Remove ${r.surveyId}`}
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Field data"
        title="Monitoring sites"
        description="Every survey location registered on the platform, with the device assigned to it."
        actions={<Button icon={Plus} onClick={() => setOpen(true)}>Add site</Button>}
      />

      <Card>
        <div className="flex flex-col gap-3 border-b border-sand-200 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by location or survey ID"
              className="w-full rounded-lg border border-sand-200 bg-sand-50 py-2 pl-9 pr-3 text-sm focus:border-moss-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-moss-100"
            />
          </div>
          <Select value={habitat} onChange={(e) => setHabitat(e.target.value)} className="sm:w-64">
            <option value="">All habitat types</option>
            {HABITAT_TYPES.map((h) => <option key={h} value={h}>{h}</option>)}
          </Select>
        </div>

        {loading && <SkeletonTable rows={6} cols={6} />}
        {error && !loading && <ErrorState message={error} onRetry={reload} />}
        {!loading && !error && (
          <Table
            columns={columns}
            rows={sites}
            empty={
              <EmptyState
                icon={MapPin}
                title="No sites match this filter"
                message="Clear the search, or register the first monitoring site for this habitat type."
                action={<Button icon={Plus} onClick={() => setOpen(true)}>Add site</Button>}
              />
            }
          />
        )}
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add monitoring site"
        description="Register a survey location so captures from its device are attributed correctly."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} loading={saving}>Save site</Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Survey ID" required error={errors.surveyId} hint="Reserve range and year, e.g. MDM-2026-014.">
            <Input value={form.surveyId} onChange={set('surveyId')} placeholder="MDM-2026-014" invalid={!!errors.surveyId} />
          </Field>
          <Field label="Monitoring location" required error={errors.location}>
            <Input value={form.location} onChange={set('location')} placeholder="Kargudi Range, Mudumalai" invalid={!!errors.location} />
          </Field>
          <Field label="Latitude" required error={errors.lat}>
            <Input value={form.lat} onChange={set('lat')} placeholder="11.5964" invalid={!!errors.lat} />
          </Field>
          <Field label="Longitude" required error={errors.lng}>
            <Input value={form.lng} onChange={set('lng')} placeholder="76.5347" invalid={!!errors.lng} />
          </Field>
          <Field label="Habitat type">
            <Select value={form.habitatType} onChange={set('habitatType')}>
              {HABITAT_TYPES.map((h) => <option key={h}>{h}</option>)}
            </Select>
          </Field>
          <Field label="Survey date" required error={errors.surveyDate}>
            <Input type="date" value={form.surveyDate} onChange={set('surveyDate')} invalid={!!errors.surveyDate} />
          </Field>
          <Field label="Device type">
            <Select value={form.deviceType} onChange={set('deviceType')}>
              {DEVICE_TYPES.map((d) => <option key={d}>{d}</option>)}
            </Select>
          </Field>
          <Field label="Device ID" hint="Leave blank for manual transects.">
            <Input value={form.deviceId} onChange={set('deviceId')} placeholder="CT-441" />
          </Field>
          <Field label="Protected area" className="sm:col-span-2">
            <Input value={form.protectedArea} onChange={set('protectedArea')} placeholder="Mudumalai Tiger Reserve" />
          </Field>
        </div>
      </Modal>
    </>
  );
}
