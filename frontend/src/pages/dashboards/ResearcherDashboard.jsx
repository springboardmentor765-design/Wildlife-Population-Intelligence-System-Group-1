import { Link } from 'react-router-dom';
import {
  Bird,
  Camera,
  Gauge,
  ListChecks,
  Users,
  CheckCircle,
  Mic,
  ArrowRight,
} from 'lucide-react';

import { Card, CardHeader } from '../../components/ui/Card';
import { StatTile } from '../../components/ui/StatTile';
import { Table } from '../../components/ui/Table';
import { timeAgo } from '../../utils/format';

const ICONS = {
  population: Users,
  observations: Camera,
  species: Bird,
  pending: ListChecks,
  accuracy: Gauge,
};

export function ResearcherDashboard({ data }) {
  return (
    <div className="space-y-6">

      {/* =====================================================
          SUMMARY
      ===================================================== */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.tiles.map((t) => (
          <StatTile
            key={t.key}
            label={t.label}
            value={t.value}
            unit={t.unit}
            delta={t.delta}
            icon={ICONS[t.key]}
          />
        ))}
      </div>


      {/* =====================================================
          START NEW OBSERVATION
      ===================================================== */}
      <Card>
        <div className="px-5 py-5 sm:px-6">
          <div className="mb-4">
            <p className="text-[10px] uppercase tracking-[0.18em] font-medium text-moss-600">
              Field workflow
            </p>

            <h2 className="mt-1 font-display text-xl text-ink-900">
              Start a new observation
            </h2>

            <p className="mt-1 text-sm text-ink-500">
              Add new field evidence and let the system identify wildlife
              through image or audio analysis.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">

            {/* Camera trap */}
            <Link
              to="/camera-traps"
              className="group flex items-center justify-between rounded-xl border border-sand-200 bg-sand-50/60 p-4 transition hover:border-moss-300 hover:bg-moss-50"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-moss-600 shadow-sm">
                  <Camera size={20} />
                </span>

                <div>
                  <p className="text-sm font-semibold text-ink-900">
                    Analyze camera-trap image
                  </p>

                  <p className="mt-0.5 text-xs text-ink-500">
                    Detect wildlife from an image
                  </p>
                </div>
              </div>

              <ArrowRight
                size={17}
                className="text-ink-400 transition group-hover:translate-x-1 group-hover:text-moss-600"
              />
            </Link>


            {/* Bioacoustics */}
            <Link
              to="/bioacoustics"
              className="group flex items-center justify-between rounded-xl border border-sand-200 bg-sand-50/60 p-4 transition hover:border-moss-300 hover:bg-moss-50"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-moss-600 shadow-sm">
                  <Mic size={20} />
                </span>

                <div>
                  <p className="text-sm font-semibold text-ink-900">
                    Analyze bioacoustic recording
                  </p>

                  <p className="mt-0.5 text-xs text-ink-500">
                    Identify wildlife from audio
                  </p>
                </div>
              </div>

              <ArrowRight
                size={17}
                className="text-ink-400 transition group-hover:translate-x-1 group-hover:text-moss-600"
              />
            </Link>

          </div>
        </div>
      </Card>


      {/* =====================================================
          RECENT OBSERVATIONS
      ===================================================== */}
      <Card>
        <CardHeader
          eyebrow="Latest detections"
          title="Recent wildlife observations"
        />

        <Table
          columns={[
            {
              key: 'species',
              header: 'Species',
              render: (r) => (
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink-900">
                    {r.species}
                  </p>

                  {r.binomial && (
                    <p className="binomial truncate text-[12px]">
                      {r.binomial}
                    </p>
                  )}
                </div>
              ),
            },

            {
              key: 'detection',
              header: 'Detection',
              render: () => (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-moss-50 px-2.5 py-1 text-[11px] font-medium text-moss-700">
                  <CheckCircle size={12} />
                  AI detected
                </span>
              ),
            },

            {
              key: 'confidence',
              header: 'Confidence',
              render: (r) => (
                <span className="text-[13px] font-medium text-ink-700">
                  {r.confidence != null
                    ? `${(Number(r.confidence) * 100).toFixed(0)}%`
                    : '—'}
                </span>
              ),
            },

            {
              key: 'at',
              header: 'Seen',
              align: 'right',
              render: (r) => (
                <div>
                  <p className="text-[13px] text-ink-700">
                    {timeAgo(r.at)}
                  </p>

                  <p className="text-[11px] text-ink-500">
                    {r.site}
                  </p>
                </div>
              ),
            },
          ]}
          rows={data.recentObservations}
        />
      </Card>

    </div>
  );
}