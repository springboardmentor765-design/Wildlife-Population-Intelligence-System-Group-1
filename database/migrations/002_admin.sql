--
-- Migration 002 — Admin module
--
-- Adds the columns the administration pages need:
--   * users          -> status / org / last_active (user management)
--   * monitoring_sites -> battery (device fleet view)
--
-- Idempotent; safe to re-run.
--

--
-- User management
-- ------------------------------------------------------------------

ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS status text DEFAULT 'active'::text,
    ADD COLUMN IF NOT EXISTS org text,
    ADD COLUMN IF NOT EXISTS last_active timestamp with time zone;

--
-- Device fleet (monitoring sites)
-- ------------------------------------------------------------------

ALTER TABLE public.monitoring_sites
    ADD COLUMN IF NOT EXISTS battery integer DEFAULT 100;

UPDATE public.monitoring_sites
SET battery = CASE id
    WHEN 'site-01' THEN 78
    WHEN 'site-02' THEN 64
    WHEN 'site-03' THEN 100
    WHEN 'site-04' THEN 11
    WHEN 'site-05' THEN 91
    WHEN 'site-06' THEN 100
    ELSE battery
END
WHERE id IN ('site-01', 'site-02', 'site-03', 'site-04', 'site-05', 'site-06');
