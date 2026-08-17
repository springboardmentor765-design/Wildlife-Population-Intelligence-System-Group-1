import { useState } from 'react';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Field, Select, Input } from '../components/ui/Field';
import { Badge } from '../components/ui/Badge';
import { SkeletonTable } from '../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../components/ui/States';
import { useAsync } from '../hooks/useAsync';
import { reportService } from '../services/reportService';
import { mockSites } from '../mock/sites';
import { formatDateTime } from '../utils/format';
import { clsx } from '../utils/cn';

export default function Reports() {
  const { data, loading, error, reload } = useAsync(() => reportService.catalogue(), []);
  const [filters, setFilters] = useState({ type: 'survey', site: '', from: '', to: '', species: '' });
  const [busy, setBusy] = useState(null);

  const set = (k) => (e) => setFilters({ ...filters, [k]: e.target.value });

  const run = async (format) => {
    setBusy(format);
    try {
      await reportService.export(format, filters);
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Operations"
        title="Reports"
        description="Build a report from the survey record, then export it for circulation or archiving."
      />

      {loading && (
        <div className="space-y-6">
          <Card><SkeletonTable rows={4} cols={3} /></Card>
        </div>
      )}
      {error && !loading && <ErrorState message={error} onRetry={reload} />}

      {data && !loading && !error && (
        <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
          <Card className="xl:self-start">
            <CardHeader eyebrow="Build" title="Report filters" description="Everything left blank defaults to the full record." />
            <CardBody className="space-y-4">
              <Field label="Report type">
                <Select value={filters.type} onChange={set('type')}>
                  {data.types.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
                </Select>
              </Field>
              <p className="-mt-2 text-[12px] leading-relaxed text-ink-500">
                {data.types.find((t) => t.id === filters.type)?.desc}
              </p>

              <Field label="Monitoring site">
                <Select value={filters.site} onChange={set('site')}>
                  <option value="">All sites</option>
                  {mockSites.map((s) => <option key={s.id} value={s.id}>{s.location}</option>)}
                </Select>
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="From"><Input type="date" value={filters.from} onChange={set('from')} /></Field>
                <Field label="To"><Input type="date" value={filters.to} onChange={set('to')} /></Field>
              </div>

              <Field label="Species filter" hint="Common or scientific name.">
                <Input value={filters.species} onChange={set('species')} placeholder="e.g. Elephas maximus" />
              </Field>

              <div className="flex flex-col gap-2.5 border-t border-sand-200 pt-4 sm:flex-row">
                <Button icon={FileText} loading={busy === 'pdf'} onClick={() => run('pdf')} className="flex-1">
                  Export PDF
                </Button>
                <Button variant="earth" icon={FileSpreadsheet} loading={busy === 'xlsx'} onClick={() => run('xlsx')} className="flex-1">
                  Export Excel
                </Button>
              </div>
              <p className="text-[12px] text-ink-500">
                Exports run against the live API once VITE_API_URL is connected. In mock mode a
                placeholder file is downloaded.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader eyebrow="History" title="Recently generated" description="Reports stay available for 90 days." />
            {data.recent.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No reports generated yet"
                message="Set your filters on the left and export a PDF or Excel file to start the archive."
              />
            ) : (
              <Table
                columns={[
                  {
                    key: 'name', header: 'Report',
                    render: (r) => (
                      <div className="min-w-0">
                        <p className="truncate font-medium text-ink-900">{r.name}</p>
                        <p className="text-[12px] text-ink-500">by {r.by}</p>
                      </div>
                    ),
                  },
                  {
                    key: 'format', header: 'Format',
                    render: (r) => (
                      <Badge tone={r.format === 'PDF' ? 'clay' : 'moss'}>{r.format} · {r.size}</Badge>
                    ),
                  },
                  {
                    key: 'generatedAt', header: 'Generated',
                    render: (r) => <span className="font-mono text-[12px]">{formatDateTime(r.generatedAt)}</span>,
                  },
                  {
                    key: 'actions', header: '', align: 'right',
                    render: () => (
                      <Button size="sm" variant="ghost" icon={Download}>Download</Button>
                    ),
                  },
                ]}
                rows={data.recent}
              />
            )}
          </Card>
        </div>
      )}
    </>
  );
}
