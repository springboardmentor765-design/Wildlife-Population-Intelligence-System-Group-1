import { useState } from 'react';
import {
  Download,
  FileSpreadsheet,
  FileText,
  Loader2,
} from 'lucide-react';

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
import { formatDateTime } from '../utils/format';

export default function Reports() {
  const {
    data,
    loading,
    error,
    reload,
  } = useAsync(
    () => reportService.catalogue(),
    []
  );

  const [filters, setFilters] = useState({
    type: 'survey',
    from: '',
    to: '',
    species: '',
  });

  const [busy, setBusy] = useState(null);
  const [downloadBusy, setDownloadBusy] = useState(null);

  const [success, setSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  const set = (key) => (event) => {
    setFilters((previous) => ({
      ...previous,
      [key]: event.target.value,
    }));
  };

  // ==========================================================
  // GENERATE REPORT
  // ==========================================================

  const run = async (format) => {
    setBusy(format);
    setSuccess('');
    setActionError('');

    try {
      await reportService.export(
        format,
        filters
      );

      setSuccess(
        `${format.toUpperCase()} report generated successfully.`
      );

      // Refresh "Recently generated"
      await reload();

    } catch (err) {
      setActionError(
        err?.response?.data?.detail ||
        err?.message ||
        'Report generation failed.'
      );
    } finally {
      setBusy(null);
    }
  };

  // ==========================================================
  // DOWNLOAD EXISTING REPORT
  // ==========================================================

  const downloadReport = async (report) => {
    setDownloadBusy(report.id);
    setActionError('');

    try {
      await reportService.download(
        report.id,
        report.name
      );
    } catch (err) {
      setActionError(
        err?.response?.data?.detail ||
        err?.message ||
        'Report download failed.'
      );
    } finally {
      setDownloadBusy(null);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Operations"
        title="Reports"
        description="Build a report from the survey record, then export it for circulation or archiving."
      />

      {/* ======================================================
          LOADING
      ====================================================== */}

      {loading && (
        <div className="space-y-6">
          <Card>
            <SkeletonTable
              rows={4}
              cols={3}
            />
          </Card>
        </div>
      )}

      {/* ======================================================
          INITIAL LOAD ERROR
      ====================================================== */}

      {error && !loading && (
        <ErrorState
          message={error}
          onRetry={reload}
        />
      )}

      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      {data && !loading && !error && (
        <div className="grid gap-6 xl:grid-cols-[420px_1fr]">

          {/* ==================================================
              REPORT BUILDER
          ================================================== */}

          <Card className="xl:self-start">

            <CardHeader
              eyebrow="Build"
              title="Report filters"
              description="Everything left blank defaults to the full record."
            />

            <CardBody className="space-y-4">

              {/* ----------------------------------------------
                  REPORT TYPE
              ---------------------------------------------- */}

              <Field label="Report type">

                <Select
                  value={filters.type}
                  onChange={set('type')}
                >
                  {data.types.map((type) => (
                    <option
                      key={type.id}
                      value={type.id}
                    >
                      {type.label}
                    </option>
                  ))}
                </Select>

              </Field>

              <p className="-mt-2 text-[12px] leading-relaxed text-ink-500">
                {
                  data.types.find(
                    (type) =>
                      type.id === filters.type
                  )?.desc
                }
              </p>

              {/* ----------------------------------------------
                  DATE RANGE
              ---------------------------------------------- */}

              <div className="grid gap-4 sm:grid-cols-2">

                <Field label="From">

                  <Input
                    type="date"
                    value={filters.from}
                    onChange={set('from')}
                  />

                </Field>

                <Field label="To">

                  <Input
                    type="date"
                    value={filters.to}
                    onChange={set('to')}
                  />

                </Field>

              </div>

              {/* ----------------------------------------------
                  SPECIES
              ---------------------------------------------- */}

              <Field
                label="Species filter"
                hint="Common or scientific name."
              >

                <Input
                  value={filters.species}
                  onChange={set('species')}
                  placeholder="e.g. Elephas maximus"
                />

              </Field>

              {/* ----------------------------------------------
                  EXPORT BUTTONS
              ---------------------------------------------- */}

              <div className="flex flex-col gap-2.5 border-t border-sand-200 pt-4 sm:flex-row">

                <Button
                  icon={FileText}
                  loading={busy === 'pdf'}
                  disabled={Boolean(busy)}
                  onClick={() => run('pdf')}
                  className="flex-1"
                >
                  Export PDF
                </Button>

                <Button
                  variant="earth"
                  icon={FileSpreadsheet}
                  loading={busy === 'xlsx'}
                  disabled={Boolean(busy)}
                  onClick={() => run('xlsx')}
                  className="flex-1"
                >
                  Export Excel
                </Button>

              </div>

              {/* ----------------------------------------------
                  GENERATING MESSAGE
              ---------------------------------------------- */}

              {busy && (
                <p className="flex items-center gap-2 text-[12px] text-ink-500">

                  <Loader2
                    size={14}
                    className="animate-spin"
                  />

                  Generating{' '}
                  {
                    data.types.find(
                      (type) =>
                        type.id === filters.type
                    )?.label || 'report'
                  }
                  …

                </p>
              )}

              {/* ----------------------------------------------
                  SUCCESS
              ---------------------------------------------- */}

              {success && (
                <p className="text-[12px] text-moss-600">
                  {success}
                </p>
              )}

              {/* ----------------------------------------------
                  ERROR
              ---------------------------------------------- */}

              {actionError && (
                <p className="text-[12px] text-red-600">
                  {actionError}
                </p>
              )}

            </CardBody>

          </Card>

          {/* ==================================================
              REPORT HISTORY
          ================================================== */}

          <Card>

            <CardHeader
              eyebrow="History"
              title="Recently generated"
              description="Reports stay available for 90 days."
            />

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
    key: 'name',
    header: 'Report',
    render: (report) => (
      <div className="min-w-0">
        <p className="truncate font-medium text-ink-900">
          {report.name}
        </p>
        <p className="text-[12px] text-ink-500">
          by {report.by}
        </p>
      </div>
    ),
  },

  {
    key: 'format',
    header: 'Format',
    render: (report) => (
      <Badge
        tone={report.format === 'PDF' ? 'clay' : 'moss'}
      >
        {report.format} · {report.size}
      </Badge>
    ),
  },

  {
    key: 'generatedAt',
    header: 'Generated',
    render: (report) => (
      <span className="font-mono text-[12px]">
        {formatDateTime(report.generatedAt)}
      </span>
    ),
  },

  {
    key: 'actions',
    header: '',
    align: 'right',
    render: (report) => (
      <Button
        size="sm"
        variant="ghost"
        icon={Download}
        loading={downloadBusy === report.id}
        onClick={() => downloadReport(report)}
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