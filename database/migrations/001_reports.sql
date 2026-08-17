--
-- Migration 001 — Automatic report generator
--
-- Adds the `reports` archive table and the `monitoring_sites` registry
-- used by the report generator. Idempotent; safe to re-run.
--

--
-- Reports archive
-- ------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.reports (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    format text NOT NULL,
    size_bytes bigint NOT NULL,
    file_path text NOT NULL,
    filters jsonb DEFAULT '{}'::jsonb NOT NULL,
    generated_by uuid,
    generated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT reports_pkey PRIMARY KEY (id),
    CONSTRAINT reports_format_check CHECK (format IN ('PDF', 'XLSX')),
    CONSTRAINT reports_generated_by_fkey
        FOREIGN KEY (generated_by) REFERENCES public.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_reports_generated_at ON public.reports (generated_at DESC);

--
-- Monitoring site registry
-- ------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.monitoring_sites (
    id text NOT NULL,
    survey_id text,
    location text NOT NULL,
    lat double precision,
    lng double precision,
    habitat_type text,
    protected_area text,
    device_type text,
    status text DEFAULT 'active'::text,
    CONSTRAINT monitoring_sites_pkey PRIMARY KEY (id)
);
