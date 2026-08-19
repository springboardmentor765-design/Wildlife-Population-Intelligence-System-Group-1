import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
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

export default function Reports() {
  const { data, loading, error, reload } = useAsync(() => reportService.catalogue(), []);
  const [filters, setFilters] = useState({ type: 'survey', site: '', from: '', to: '', species: '' });
  const [busy, setBusy] = useState(null);
  const [genError, setGenError] = useState(null);
  const [genSuccess, setGenSuccess] = useState(null);
  const [downloading, setDownloading] = useState(null);
  const [downloadError, setDownloadError] = useState(null);

  const set = (k) => (e) => setFilters({ ...filters, [k]: e.target.value });

  const run = async (format) => {
    setBusy(format);
    setGenError(null);
    setGenSuccess(null);
    try {
      await reportService.export(format, filters);
      setGenSuccess(`Report generated. Download it from the table, or export again.`);
      reload();
    } catch (err) {
      setGenError(err.message || 'Report generation failed.');
    } finally {
      setBusy(null);
    }
  };

  const download = async (report) => {
    setDownloading(report.id);
    setDownloadError(null);
    try {
      await reportService.download(report.id, report.name);
    } catch (err) {
      setDownloadError(err.message || 'Download failed.');
    } finally {
      setDownloading(null);
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
                <Button icon={FileText} loading={busy === 'pdf'} disabled={Boolean(busy)} onClick={() => run('pdf')} className="flex-1">
                  Export PDF
                </Button>
                <Button variant="earth" icon={FileSpreadsheet} loading={busy === 'xlsx'} disabled={Boolean(busy)} onClick={() => run('xlsx')} className="flex-1">
                  Export Excel
                </Button>
              </div>

              {busy && (
                <p className="flex items-center gap-2 text-[12px] text-ink-500">
                  <Loader2 size={14} className="animate-spin" />
                  Generating {data.types.find((t) => t.id === filters.type)?.label ?? 'report'}… this can take a few seconds.
                </p>
              )}
              {genError && <p className="text-[12px] text-red-600">{genError}</p>}
              {genSuccess && <p className="text-[12px] text-moss-600">{genSuccess}</p>}
            </CardBody>
          </Card>

          <Card>
            <CardHeader eyebrow="History" title="Recently generated" description="Reports stay available for 90 days." />
            {downloadError && (
              <p className="px-4 pb-2 text-[12px] text-red-600">{downloadError}</p>
            )}
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
                    render: (r) => (
                      <Button
                        size="sm"
                        variant="ghost"
                        icon={Download}
                        loading={downloading === r.id}
                        onClick={() => download(r)}
                      >
                        Download
                      </Button>
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
