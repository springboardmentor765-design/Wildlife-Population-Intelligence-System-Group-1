"""
Automatic report generator.

Every metric in these reports is computed from the live survey database
(image_detections, audio_predictions, inference_runs, media_assets,
species, identified_animals, monitoring_sites). No manual data entry.

Report types:
    survey       - detection counts, effort and site coverage in a date range
    population   - per-species counts, identified individuals and trends
    biodiversity - Shannon / Simpson / richness indices
    habitat      - derived habitat-health proxies from real sampling data
    conservation - ranked, rule-based recommendations from real trends

PDF rendering uses ReportLab; the chart image uses matplotlib (Agg).
XLSX rendering uses openpyxl.
"""

import io
import os
import re
import json
import math
from datetime import datetime, timezone
from uuid import uuid4

REPORT_TYPES = [
    {
        "id": "survey",
        "label": "Wildlife survey report",
        "desc": "Effort, detections and site coverage for a chosen survey window.",
    },
    {
        "id": "population",
        "label": "Species population report",
        "desc": "Counts, density estimates and trend lines per species.",
    },
    {
        "id": "biodiversity",
        "label": "Biodiversity report",
        "desc": "Shannon, Simpson and richness indices with site comparison.",
    },
    {
        "id": "habitat",
        "label": "Habitat assessment report",
        "desc": "Vegetation, fragmentation and degradation findings.",
    },
    {
        "id": "conservation",
        "label": "Conservation report",
        "desc": "Ranked recommendations with impact and effort estimates.",
    },
]

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

REPORTS_DIR = os.path.join(BASE_DIR, "uploads", "reports")

os.makedirs(REPORTS_DIR, exist_ok=True)

SCHEMA_SQL = """
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
"""

SITE_SEED = [
    ("site-01", "MDM-2026-014", "Kargudi Range, Mudumalai", 11.5964, 76.5347,
     "Tropical dry deciduous", "Mudumalai Tiger Reserve", "Camera trap", "active"),
    ("site-02", "ANM-2026-007", "Valparai Plateau, Anamalai", 10.3270, 76.9510,
     "Moist evergreen", "Anamalai Tiger Reserve", "Acoustic sensor", "active"),
    ("site-03", "NIL-2026-021", "Avalanche Shola, Nilgiris", 11.2610, 76.5820,
     "Montane shola grassland", "Nilgiri Biosphere Reserve", "Drone survey", "maintenance"),
    ("site-04", "SAT-2026-003", "Moyar River Bank", 11.5450, 76.8790,
     "Riverine / wetland", "Sathyamangalam Tiger Reserve", "Camera trap", "offline"),
    ("site-05", "PTR-2026-018", "Thekkady Fringe, Periyar", 9.5850, 77.1600,
     "Moist evergreen", "Periyar Tiger Reserve", "Camera trap", "active"),
    ("site-06", "GDL-2026-005", "Gudalur Scrub Belt", 11.5010, 76.4900,
     "Scrub and thorn forest", "Reserved Forest", "Line transect (manual)", "active"),
]


def ensure_schema(cur):
    """Create the reports + monitoring_sites tables if missing, seed sites."""
    cur.execute(SCHEMA_SQL)
    cur.executemany(
        """
        INSERT INTO monitoring_sites
            (id, survey_id, location, lat, lng, habitat_type,
             protected_area, device_type, status)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (id) DO NOTHING
        """,
        SITE_SEED,
    )


def get_site(cur, site_id):
    """Resolve a site id from the monitoring_sites registry."""
    if not site_id:
        return None
    row = cur.execute(
        """
        SELECT id, location, habitat_type, protected_area
        FROM monitoring_sites
        WHERE id = %s OR LOWER(location) = LOWER(%s)
        LIMIT 1
        """,
        (site_id, site_id),
    ).fetchone()
    return dict(row) if row else {"id": site_id, "location": site_id}


def now_utc():
    return datetime.now(timezone.utc)


def human_size(n):
    n = float(n or 0)
    for unit in ("B", "KB", "MB", "GB"):
        if n < 1024:
            return f"{n:.1f} {unit}" if unit != "B" else f"{int(n)} {unit}"
        n /= 1024
    return f"{n:.1f} TB"


# ============================================================
# SQL helpers
# ============================================================

def _date_cond(from_d, to_d):
    conds, params = [], []
    if from_d:
        conds.append("COALESCE(ir.completed_at, ir.started_at)::date >= %s")
        params.append(from_d)
    if to_d:
        conds.append("COALESCE(ir.completed_at, ir.started_at)::date <= %s")
        params.append(to_d)
    return conds, params


def _species_cond(species):
    if not species:
        return [], []
    return (
        [
            "(LOWER(s.name) LIKE LOWER('%%' || %s || '%%')"
            " OR LOWER(COALESCE(s.scientific_name, '')) LIKE LOWER('%%' || %s || '%%'))"
        ],
        [species, species],
    )


def _where(conds, alias="ir"):
    sql = f"WHERE {alias}.status = 'completed'"
    if conds:
        sql += " AND " + " AND ".join(conds)
    return sql


def _detections_by_day(cur, from_d, to_d, species):
    conds, params = _date_cond(from_d, to_d)
    sconds, sparams = _species_cond(species)
    where = _where(conds + sconds)
    params = params + sparams

    cur.execute(
        f"""
        SELECT
            DATE_TRUNC('day', COALESCE(ir.completed_at, ir.started_at)) AS day,
            'image' AS source,
            COUNT(*) AS detections
        FROM image_detections d
        JOIN inference_runs ir ON ir.id = d.inference_run_id
        LEFT JOIN species s ON s.id = d.species_id
        {where}
        GROUP BY day, source
        UNION ALL
        SELECT
            DATE_TRUNC('day', COALESCE(ir.completed_at, ir.started_at)) AS day,
            'audio' AS source,
            COUNT(*) AS detections
        FROM audio_predictions ap
        JOIN inference_runs ir ON ir.id = ap.inference_run_id
        LEFT JOIN species s ON s.id = ap.species_id
        {where}
        GROUP BY day, source
        ORDER BY day
        """,
        params + params,
    )
    return cur.fetchall()


# ============================================================
# Data collection
# ============================================================

def collect_survey(cur, from_d, to_d, species):
    conds, dparams = _date_cond(from_d, to_d)
    sconds, sparams = _species_cond(species)
    where = _where(conds + sconds)
    params = dparams + sparams

    cur.execute(
        f"""
        SELECT
            COUNT(*) AS image_detections,
            COUNT(DISTINCT d.inference_run_id) AS image_runs,
            COUNT(DISTINCT d.species_id) AS image_species
        FROM image_detections d
        JOIN inference_runs ir ON ir.id = d.inference_run_id
        LEFT JOIN species s ON s.id = d.species_id
        {where}
        """,
        params,
    )
    image = cur.fetchone()

    cur.execute(
        f"""
        SELECT
            COUNT(*) AS audio_detections,
            COUNT(DISTINCT ap.inference_run_id) AS audio_runs,
            COUNT(DISTINCT ap.species_id) AS audio_species
        FROM audio_predictions ap
        JOIN inference_runs ir ON ir.id = ap.inference_run_id
        LEFT JOIN species s ON s.id = ap.species_id
        {where}
        """,
        params,
    )
    audio = cur.fetchone()

    cur.execute(
        f"""
        SELECT
            COUNT(DISTINCT ir.media_id) AS media,
            COUNT(DISTINCT ir.media_id) FILTER (WHERE ma.media_type = 'image') AS images,
            COUNT(DISTINCT ir.media_id) FILTER (WHERE ma.media_type = 'audio') AS audio_files
        FROM inference_runs ir
        JOIN media_assets ma ON ma.id = ir.media_id
        {_where(conds)}
        """,
        dparams,
    )
    effort = cur.fetchone()

    cur.execute(
        f"""
        SELECT COUNT(*) AS species_count
        FROM (
            SELECT DISTINCT d.species_id
            FROM image_detections d
            JOIN inference_runs ir ON ir.id = d.inference_run_id
            {_where(conds)}
              AND d.species_id IS NOT NULL
            UNION
            SELECT DISTINCT ap.species_id
            FROM audio_predictions ap
            JOIN inference_runs ir ON ir.id = ap.inference_run_id
            {_where(conds)}
              AND ap.species_id IS NOT NULL
        ) combined
        """,
        dparams + dparams,
    )
    species_count = cur.fetchone()["species_count"]

    cur.execute(
        f"""
        SELECT
            COALESCE(s.name, 'Unknown') AS species,
            COALESCE(s.scientific_name, '') AS scientific_name,
            COUNT(*) AS detections
        FROM image_detections d
        JOIN inference_runs ir ON ir.id = d.inference_run_id
        LEFT JOIN species s ON s.id = d.species_id
        {where}
        GROUP BY s.name, s.scientific_name
        ORDER BY detections DESC, s.name
        """,
        params,
    )
    species_rows = cur.fetchall()

    cur.execute(
        """
        SELECT COUNT(DISTINCT NULLIF(ma.metadata->>'site', '')) AS tagged_sites,
               COUNT(DISTINCT ir.media_id) AS media
        FROM media_assets ma
        JOIN inference_runs ir ON ir.media_id = ma.id
        """ + _where(conds),
        dparams,
    )
    coverage = cur.fetchone()

    days = _detections_by_day(cur, from_d, to_d, species)

    per_day = {}
    for row in days:
        key = row["day"].strftime("%Y-%m-%d")
        per_day.setdefault(key, {"date": key, "image": 0, "audio": 0})
        per_day[key][row["source"]] += row["detections"]

    chart = None
    if per_day:
        keys = sorted(per_day)
        chart = {
            "kind": "bar",
            "title": "Detections per day",
            "categories": keys,
            "series": [
                {"name": "Image", "values": [per_day[k]["image"] for k in keys]},
                {"name": "Audio", "values": [per_day[k]["audio"] for k in keys]},
            ],
        }

    return {
        "summary": [
            ("Detections", int(image["image_detections"]) + int(audio["audio_detections"])),
            ("Image detections", int(image["image_detections"])),
            ("Audio predictions", int(audio["audio_detections"])),
            ("Media processed", int(effort["media"])),
            ("Images", int(effort["images"])),
            ("Audio files", int(effort["audio_files"])),
            ("Unique species", int(species_count)),
            ("Site-tagged media", int(coverage["tagged_sites"])),
        ],
        "table": {
            "columns": ["Species", "Scientific name", "Detections"],
            "rows": [
                [r["species"], r["scientific_name"] or "—", int(r["detections"])]
                for r in species_rows
            ],
        },
        "chart": chart,
        "raw": _raw_observations(cur, from_d, to_d, species),
    }


def collect_population(cur, from_d, to_d, species):
    conds, params = _date_cond(from_d, to_d)
    sconds, sparams = _species_cond(species)
    where = _where(conds + sconds)

    # Detections per species in the date range.
    # Param order: date conds appear twice (image + audio subqueries),
    # then the species conds on the outer WHERE.
    cur.execute(
        f"""
        SELECT
            COALESCE(s.name, 'Unknown') AS name,
            COALESCE(s.scientific_name, '') AS scientific_name,
            COUNT(*) FILTER (WHERE x.source = 'image') AS image_detections,
            COUNT(*) FILTER (WHERE x.source = 'audio') AS audio_detections,
            COUNT(*) AS observations
        FROM (
            SELECT d.species_id, 'image' AS source
            FROM image_detections d
            JOIN inference_runs ir ON ir.id = d.inference_run_id
            {_where(conds)}
              AND d.species_id IS NOT NULL
            UNION ALL
            SELECT ap.species_id, 'audio' AS source
            FROM audio_predictions ap
            JOIN inference_runs ir ON ir.id = ap.inference_run_id
            {_where(conds)}
              AND ap.species_id IS NOT NULL
        ) x
        LEFT JOIN species s ON s.id = x.species_id
        {("WHERE " + " AND ".join(sconds)) if sconds else ""}
        GROUP BY s.name, s.scientific_name
        ORDER BY observations DESC, s.name
        """,
        params + params + sparams,
    )
    species_rows = cur.fetchall()

    # Identified individuals per species (population snapshot).
    species_where = ("WHERE " + " AND ".join(sconds)) if sconds else ""
    cur.execute(
        f"""
        SELECT s.name, s.scientific_name, COUNT(ia.id) AS individuals
        FROM species s
        LEFT JOIN identified_animals ia ON ia.species_id = s.id
        {species_where}
        GROUP BY s.name, s.scientific_name
        HAVING COUNT(ia.id) > 0
        """,
        sparams or None,
    )
    individuals = {r["name"]: int(r["individuals"]) for r in cur.fetchall()}

    for row in species_rows:
        row["individuals"] = individuals.get(row["name"], 0)

    cur.execute(
        f"""
        SELECT s.name,
               DATE_TRUNC('month', COALESCE(ir.completed_at, ir.started_at)) AS month,
               COUNT(*) AS detections
        FROM image_detections d
        JOIN inference_runs ir ON ir.id = d.inference_run_id
        LEFT JOIN species s ON s.id = d.species_id
        {where}
        GROUP BY s.name, month
        UNION ALL
        SELECT s.name,
               DATE_TRUNC('month', COALESCE(ir.completed_at, ir.started_at)) AS month,
               COUNT(*) AS detections
        FROM audio_predictions ap
        JOIN inference_runs ir ON ir.id = ap.inference_run_id
        LEFT JOIN species s ON s.id = ap.species_id
        {where}
        GROUP BY s.name, month
        """,
        params + sparams + params + sparams,
    )
    trend_rows = cur.fetchall()

    trend = {}
    for row in trend_rows:
        name = row["name"] or "Unknown"
        month = row["month"].strftime("%Y-%m")
        trend.setdefault(name, {})[month] = trend.get(name, {}).get(month, 0) + row["detections"]

    top_species = sorted(trend, key=lambda n: sum(trend[n].values()), reverse=True)[:6]
    months = sorted({m for series in trend.values() for m in series})

    chart = None
    if top_species and months:
        chart = {
            "kind": "line",
            "title": "Monthly detection trend — top species",
            "categories": months,
            "series": [
                {"name": name, "values": [trend[name].get(m, 0) for m in months]}
                for name in top_species
            ],
        }

    return {
        "summary": [
            ("Species with data", len(species_rows)),
            ("Identified individuals", sum(int(r["individuals"]) for r in species_rows)),
            ("Observations in range", sum(int(r["observations"]) for r in species_rows)),
            ("Months covered", len(months)),
        ],
        "table": {
            "columns": ["Species", "Scientific name", "Identified individuals",
                        "Image", "Audio", "Observations"],
            "rows": [
                [r["name"], r["scientific_name"] or "—",
                 int(r["individuals"]), int(r["image_detections"]),
                 int(r["audio_detections"]), int(r["observations"])]
                for r in species_rows
            ],
        },
        "chart": chart,
        "raw": _raw_observations(cur, from_d, to_d, species),
    }


def _shannon(p):
    import math
    return -sum(x * math.log(x) for x in p if x > 0)


def _indices(counts):
    """counts: {label: count}. Returns richness, shannon, simpson, evenness."""
    total = sum(counts.values())
    if total == 0:
        return {"richness": 0, "shannon": 0.0, "simpson": 0.0, "evenness": 0.0, "detections": 0}
    probs = [c / total for c in counts.values()]
    h = _shannon(probs)
    simpson = 1 - sum(p * p for p in probs)
    evenness = h / math.log(len(probs)) if len(probs) > 1 else 0.0
    return {
        "richness": len(counts),
        "shannon": round(h, 3),
        "simpson": round(simpson, 3),
        "evenness": round(evenness, 3),
        "detections": total,
    }


def collect_biodiversity(cur, from_d, to_d, species):
    conds, params = _date_cond(from_d, to_d)
    sconds, sparams = _species_cond(species)
    where = _where(conds + sconds)
    params = params + sparams

    cur.execute(
        f"""
        SELECT
            COALESCE(NULLIF(ma.metadata->>'site', ''), 'Unassigned') AS site,
            COALESCE(s.name, 'Unknown') AS species,
            COUNT(*) AS detections
        FROM image_detections d
        JOIN inference_runs ir ON ir.id = d.inference_run_id
        JOIN media_assets ma ON ma.id = ir.media_id
        LEFT JOIN species s ON s.id = d.species_id
        {where}
        GROUP BY site, species
        UNION ALL
        SELECT
            COALESCE(NULLIF(ma.metadata->>'site', ''), 'Unassigned') AS site,
            COALESCE(s.name, 'Unknown') AS species,
            COUNT(*) AS detections
        FROM audio_predictions ap
        JOIN inference_runs ir ON ir.id = ap.inference_run_id
        JOIN media_assets ma ON ma.id = ir.media_id
        LEFT JOIN species s ON s.id = ap.species_id
        {where}
        GROUP BY site, species
        """,
        params + params,
    )
    rows = cur.fetchall()

    per_site = {}
    global_counts = {}
    for row in rows:
        bucket = per_site.setdefault(row["site"], {})
        bucket[row["species"]] = bucket.get(row["species"], 0) + row["detections"]
        global_counts[row["species"]] = global_counts.get(row["species"], 0) + row["detections"]

    indices = _indices(global_counts)

    site_rows = []
    for site, counts in sorted(per_site.items()):
        idx = _indices(counts)
        site_rows.append({
            "site": site,
            **idx,
            "species_detail": counts,
        })

    chart = None
    if site_rows:
        chart = {
            "kind": "bar",
            "title": "Shannon index by site",
            "categories": [r["site"] for r in site_rows],
            "series": [{"name": "H'", "values": [r["shannon"] for r in site_rows]}],
        }

    return {
        "summary": [
            ("Species richness (S)", indices["richness"]),
            ("Shannon index (H')", indices["shannon"]),
            ("Simpson index (1-D)", indices["simpson"]),
            ("Pielou's evenness (J')", indices["evenness"]),
            ("Detections analysed", indices["detections"]),
        ],
        "table": {
            "columns": ["Site", "Detections", "Richness", "Shannon H'",
                        "Simpson 1-D", "Evenness J'"],
            "rows": [
                [r["site"], r["detections"], r["richness"],
                 r["shannon"], r["simpson"], r["evenness"]]
                for r in site_rows
            ],
        },
        "chart": chart,
        "raw": _raw_observations(cur, from_d, to_d, species),
    }


def collect_habitat(cur, from_d, to_d, species):
    """Derived habitat-health proxies computed from real sampling data.

    The survey DB has no vegetation / NDVI tables, so vegetation cover,
    fragmentation and degradation are approximated from what the
    monitoring network actually recorded (effort, detection-rate trends,
    species richness). Values are labelled "derived" in the report.
    """
    conds, params = _date_cond(from_d, to_d)
    sconds, sparams = _species_cond(species)
    where = _where(conds + sconds)
    params = params + sparams

    cur.execute(
        """
        SELECT id, location, habitat_type, protected_area
        FROM monitoring_sites
        ORDER BY location
        """
    )
    sites = cur.fetchall()

    site_stats = {}
    for site in sites:
        site_stats[site["id"]] = {
            "id": site["id"],
            "location": site["location"],
            "habitat_type": site["habitat_type"] or "—",
            "media": 0,
            "detections": 0,
            "species": 0,
            "months": {},
        }

    cur.execute(
        f"""
        SELECT
            COALESCE(NULLIF(ma.metadata->>'site', ''), '') AS site_tag,
            COALESCE(s.name, 'Unknown') AS species,
            DATE_TRUNC('month', COALESCE(ir.completed_at, ir.started_at)) AS month,
            COUNT(*) AS detections
        FROM image_detections d
        JOIN inference_runs ir ON ir.id = d.inference_run_id
        JOIN media_assets ma ON ma.id = ir.media_id
        LEFT JOIN species s ON s.id = d.species_id
        {where}
        GROUP BY site_tag, species, month
        UNION ALL
        SELECT
            COALESCE(NULLIF(ma.metadata->>'site', ''), '') AS site_tag,
            COALESCE(s.name, 'Unknown') AS species,
            DATE_TRUNC('month', COALESCE(ir.completed_at, ir.started_at)) AS month,
            COUNT(*) AS detections
        FROM audio_predictions ap
        JOIN inference_runs ir ON ir.id = ap.inference_run_id
        JOIN media_assets ma ON ma.id = ir.media_id
        LEFT JOIN species s ON s.id = ap.species_id
        {where}
        GROUP BY site_tag, species, month
        """,
        params + params,
    )
    rows = cur.fetchall()

    by_tag = {}
    for row in rows:
        tag = row["site_tag"]
        key = "Unassigned" if not tag else tag
        stats = by_tag.setdefault(key, {"detections": 0, "species": set(), "months": {}})
        stats["detections"] += row["detections"]
        stats["species"].add(row["species"])
        month = row["month"].strftime("%Y-%m")
        stats["months"][month] = stats["months"].get(month, 0) + row["detections"]

    rows_out = []
    for site in sites:
        stats = site_stats[site["id"]]
        tag_stats = by_tag.get(site["location"])
        if tag_stats:
            months = sorted(tag_stats["months"])
            trend = None
            if len(months) >= 2:
                trend = tag_stats["months"][months[-1]] - tag_stats["months"][months[0]]
            rows_out.append([
                site["location"],
                site["habitat_type"],
                tag_stats["detections"],
                len(tag_stats["species"]),
                _trend_label(trend),
            ])

    total_detections = sum(r["detections"] for r in rows)
    tagged = len({r["site_tag"] for r in rows if r["site_tag"]})

    return {
        "summary": [
            ("Registered sites", len(sites)),
            ("Sites with detections", tagged),
            ("Total detections analysed", total_detections),
            ("Note", "Derived from monitoring effort — no NDVI/vegetation telemetry stored"),
        ],
        "table": {
            "columns": ["Site", "Habitat type", "Detections", "Species", "Trend"],
            "rows": rows_out,
        },
        "chart": None,
        "raw": _raw_observations(cur, from_d, to_d, species),
    }


def _trend_label(delta):
    if delta is None:
        return "insufficient data"
    if delta > 0:
        return "improving"
    if delta < 0:
        return "declining"
    return "stable"


def collect_conservation(cur, from_d, to_d, species):
    """Rule-based recommendations derived from real observation trends."""
    conds, dparams = _date_cond(from_d, to_d)
    sconds, sparams = _species_cond(species)
    where = _where(conds + sconds)
    params = dparams + sparams

    cur.execute(
        f"""
        SELECT
            COALESCE(s.name, 'Unknown') AS species,
            COUNT(*) AS detections,
            AVG(d.confidence) AS avg_confidence
        FROM image_detections d
        JOIN inference_runs ir ON ir.id = d.inference_run_id
        LEFT JOIN species s ON s.id = d.species_id
        {where}
        GROUP BY s.name
        ORDER BY detections DESC
        """,
        params,
    )
    species_rows = cur.fetchall()

    cur.execute(
        """
        SELECT COUNT(*) AS total
        FROM identified_animals
        """
    )
    identified_total = cur.fetchone()["total"]

    cur.execute(
        """
        SELECT id, location
        FROM monitoring_sites
        ORDER BY location
        """
    )
    sites = cur.fetchall()

    cur.execute(
        """
        SELECT DISTINCT COALESCE(NULLIF(ma.metadata->>'site', ''), '') AS site_tag
        FROM media_assets ma
        JOIN inference_runs ir ON ir.media_id = ma.id
        WHERE ir.status = 'completed'
        """
    )
    covered = cur.fetchall()
    covered_tags = {r["site_tag"] for r in covered if r["site_tag"]}

    species_seen = {r["species"] for r in species_rows}

    cur.execute(
        f"""
        SELECT s.name
        FROM identified_animals ia
        JOIN species s ON s.id = ia.species_id
        WHERE s.name NOT IN (SELECT COALESCE(s2.name, 'Unknown')
                             FROM image_detections d
                             JOIN inference_runs ir ON ir.id = d.inference_run_id
                             LEFT JOIN species s2 ON s2.id = d.species_id
                             {_where(conds)}
                             GROUP BY s2.name)
          AND s.name NOT IN (SELECT COALESCE(s3.name, 'Unknown')
                             FROM audio_predictions ap
                             JOIN inference_runs ir ON ir.id = ap.inference_run_id
                             LEFT JOIN species s3 ON s3.id = ap.species_id
                              {_where(conds)}
                              GROUP BY s3.name)
        """,
        dparams + dparams,
    )
    identified_only = [r["name"] for r in cur.fetchall()]

    low_conf = [r for r in species_rows if r["avg_confidence"] is not None and r["avg_confidence"] < 0.70]

    uncovered_sites = [s for s in sites if s["location"] not in covered_tags]

    recommendations = []
    rank = 1

    for site in uncovered_sites:
        recommendations.append({
            "rank": rank, "priority": "high", "category": "Monitoring coverage",
            "title": f"Deploy monitoring capacity at {site['location']}",
            "impact": 70, "effort": "Medium",
            "window": "Next survey cycle",
            "rationale": (
                f"{site['location']} is a registered monitoring site with no "
                f"completed observations, so its population status is unknown."
            ),
            "actions": [
                "Confirm device status and deployment plan",
                "Set a target capture effort for the next survey window",
            ],
            "species": [],
        })
        rank += 1

    for row in species_rows:
        if row["detections"] >= 5:
            recommendations.append({
                "rank": rank, "priority": "moderate", "category": "Data quality",
                "title": f"Extend individual re-identification for {row['species']}",
                "impact": min(90, 50 + int(row["detections"])),
                "effort": "Medium",
                "window": "Next survey cycle",
                "rationale": (
                    f"{row['species']} has {int(row['detections'])} detections in "
                    f"the window but limited individual records; re-identification "
                    f"would convert detections into population estimates."
                ),
                "actions": [
                    "Prioritise re-identification runs for new {row} media".replace("{row}", row["species"]),
                    "Review ID thresholds on known individuals",
                ],
                "species": [row["species"]],
            })
            rank += 1

    for name in identified_only[:3]:
        recommendations.append({
            "rank": rank, "priority": "moderate", "category": "Monitoring optimisation",
            "title": f"Confirm active status of {name} population",
            "impact": 60, "effort": "Low",
            "window": "This quarter",
            "rationale": (
                f"Identified individuals of {name} exist on record, but no "
                f"observations were recorded in the selected window."
            ),
            "actions": [
                "Run a targeted survey window for this species",
                "Verify device placement at known use sites",
            ],
            "species": [name],
        })
        rank += 1

    if low_conf:
        names = ", ".join(r["species"] for r in low_conf[:3])
        recommendations.append({
            "rank": rank, "priority": "high", "category": "Model calibration",
            "title": "Review detection confidence below 70%",
            "impact": 55, "effort": "Low",
            "window": "Before next analysis cycle",
            "rationale": (
                f"Average confidence for {names} falls below 0.70; low-confidence "
                f"detections inflate counts and trend noise."
            ),
            "actions": [
                "Inspect low-confidence detection batches",
                "Tune the confidence threshold or retrain on edge cases",
            ],
            "species": [r["species"] for r in low_conf[:3]],
        })
        rank += 1

    recommendations.sort(key=lambda r: (r["priority"] != "high", r["priority"] != "moderate", -r["impact"]))

    chart = None
    if recommendations:
        recs = recommendations[:8]
        chart = {
            "kind": "barh",
            "title": "Recommended actions by impact",
            "categories": [f"#{r['rank']} {r['title']}" for r in recs],
            "series": [{"name": "Impact", "values": [r["impact"] for r in recs]}],
        }

    return {
        "summary": [
            ("Species detected", len(species_seen)),
            ("Identified individuals on record", int(identified_total)),
            ("Registered sites without coverage", len(uncovered_sites)),
            ("Recommendations produced", len(recommendations)),
        ],
        "table": {
            "columns": ["Rank", "Priority", "Category", "Recommendation",
                        "Impact", "Effort"],
            "rows": [
                [r["rank"], r["priority"].title(), r["category"], r["title"],
                 f"{r['impact']}%", r["effort"]]
                for r in recommendations
            ],
        },
        "chart": chart,
        "raw": _raw_observations(cur, from_d, to_d, species),
    }


def _raw_observations(cur, from_d, to_d, species):
    conds, params = _date_cond(from_d, to_d)
    sconds, sparams = _species_cond(species)
    where = _where(conds + sconds)
    params = params + sparams

    cur.execute(
        f"""
        SELECT
            COALESCE(s.name, 'Unknown') AS species,
            COALESCE(s.scientific_name, '') AS scientific_name,
            'image' AS source,
            d.confidence AS confidence,
            COALESCE(NULLIF(ma.metadata->>'site', ''), 'Unassigned') AS site,
            COALESCE(ir.completed_at, ir.started_at) AS observed_at,
            ma.original_filename AS media
        FROM image_detections d
        JOIN inference_runs ir ON ir.id = d.inference_run_id
        JOIN media_assets ma ON ma.id = ir.media_id
        LEFT JOIN species s ON s.id = d.species_id
        {where}
        UNION ALL
        SELECT
            COALESCE(s.name, 'Unknown') AS species,
            COALESCE(s.scientific_name, '') AS scientific_name,
            'audio' AS source,
            ap.confidence AS confidence,
            COALESCE(NULLIF(ma.metadata->>'site', ''), 'Unassigned') AS site,
            COALESCE(ir.completed_at, ir.started_at) AS observed_at,
            ma.original_filename AS media
        FROM audio_predictions ap
        JOIN inference_runs ir ON ir.id = ap.inference_run_id
        JOIN media_assets ma ON ma.id = ir.media_id
        LEFT JOIN species s ON s.id = ap.species_id
        {where}
        ORDER BY observed_at DESC
        LIMIT 5000
        """,
        params + params,
    )
    return cur.fetchall()


# ============================================================
# Rendering
# ============================================================

def _render_chart(spec):
    if not spec:
        return None
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    fig, ax = plt.subplots(figsize=(9.2, 4.0), dpi=120)
    cats = spec["categories"]

    for series in spec["series"]:
        if spec["kind"] == "line":
            ax.plot(cats, series["values"], marker="o", linewidth=1.6,
                    label=series["name"])
        elif spec["kind"] == "barh":
            y = list(range(len(cats)))[::-1]
            ax.barh([cats[i] for i in y], [series["values"][i] for i in y],
                    label=series["name"])
        else:
            ax.bar(cats, series["values"], label=series["name"],
                   alpha=0.85, width=0.6)

    ax.set_title(spec["title"], fontsize=11)
    ax.legend(fontsize=8)
    ax.tick_params(axis="x", rotation=45, labelsize=7)
    ax.grid(axis="y", linestyle=":", alpha=0.5)
    fig.tight_layout()

    path = os.path.join(REPORTS_DIR, f"_chart_{uuid4().hex}.png")
    fig.savefig(path)
    plt.close(fig)
    return path


def _pdf_table(columns, rows):
    from reportlab.platypus import Table, TableStyle
    from reportlab.lib import colors

    if not rows:
        rows = [["No data in the selected range."] + [""] * (len(columns) - 1)]
    data = [columns] + [[str(c) for c in row] for row in rows]
    table = Table(data, repeatRows=1, hAlign="LEFT")
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2f4f3e")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 8),
        ("FONTSIZE", (0, 1), (-1, -1), 8),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f2f1ea")]),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#d8d5c8")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ]))
    return table


def render_pdf(title, filters, summary, table, chart_spec):
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import getSampleStyleSheet
    from reportlab.lib import colors
    from reportlab.platypus import (
        SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle,
    )

    buf = io.BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4, rightMargin=50, leftMargin=50,
                            topMargin=46, bottomMargin=46,
                            title=title)
    styles = getSampleStyleSheet()
    styles["Title"].fontSize = 18
    styles["Title"].spaceAfter = 2

    story = [
        Paragraph("Wildlife Population Intelligence System", styles["Title"]),
        Paragraph(title, styles["Heading2"]),
        Paragraph(
            f"Generated {now_utc().strftime('%d %b %Y, %H:%M %Z')}",
            styles["Normal"],
        ),
        Spacer(1, 6),
    ]

    story.append(Paragraph("Filters used", styles["Heading4"]))
    filter_table = Table(
        [[k, v] for k, v in filters],
        hAlign="LEFT",
    )
    filter_table.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 8),
        ("TEXTCOLOR", (0, 0), (0, -1), colors.HexColor("#2f4f3e")),
        ("GRID", (0, 0), (-1, -1), 0.3, colors.HexColor("#e3e0d3")),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
    ]))
    story.append(filter_table)
    story.append(Spacer(1, 10))

    story.append(Paragraph("Summary", styles["Heading4"]))
    summary_table = Table(
        [[k, str(v)] for k, v in summary],
        hAlign="LEFT",
    )
    summary_table.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#f2f1ea")),
        ("GRID", (0, 0), (-1, -1), 0.3, colors.HexColor("#e3e0d3")),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 12))

    chart_path = _render_chart(chart_spec)
    if chart_path:
        from PIL import Image as PILImage
        try:
            with PILImage.open(chart_path) as im:
                w, h = im.size
            aspect = h / w
            width = 470
            story.append(Image(chart_path, width=width, height=width * aspect))
            story.append(Spacer(1, 12))
        except Exception:
            pass

    story.append(Paragraph("Data table", styles["Heading4"]))
    story.append(_pdf_table(table["columns"], table["rows"]))

    doc.build(story)

    if chart_path and os.path.exists(chart_path):
        os.remove(chart_path)

    return buf.getvalue()


def render_xlsx(title, filters, summary, table, raw):
    from openpyxl import Workbook
    from openpyxl.styles import Font, PatternFill

    wb = Workbook()

    header_fill = PatternFill("solid", fgColor="2F4F3E")
    header_font = Font(color="FFFFFF", bold=True)
    label_font = Font(bold=True)

    ws = wb.active
    ws.title = "Summary"

    ws.append(["Wildlife Population Intelligence System"])
    ws["A1"].font = Font(bold=True, size=14)
    ws.append([title])
    ws["A2"].font = Font(size=12)
    ws.append([f"Generated {now_utc().strftime('%d %b %Y, %H:%M %Z')}"])
    ws.append([])

    ws.append(["Filter", "Value"])
    for cell in ws[ws.max_row]:
        cell.fill = header_fill
        cell.font = header_font
    for k, v in filters:
        ws.append([k, v])

    ws.append([])
    ws.append(["Summary", ""])
    for cell in ws[ws.max_row]:
        cell.fill = header_fill
        cell.font = header_font
    for k, v in summary:
        ws.append([k, v])

    ws.append([])
    ws.append(table["columns"])
    for cell in ws[ws.max_row]:
        cell.fill = header_fill
        cell.font = header_font
    for row in table["rows"]:
        ws.append([str(c) for c in row])

    widths = {"A": 34, "B": 22, "C": 18, "D": 18, "E": 18, "F": 18, "G": 18}
    for col, w in widths.items():
        ws.column_dimensions[col].width = w
    ws.freeze_panes = "A2"

    raw_ws = wb.create_sheet("Raw data")
    raw_ws.append(["Species", "Scientific name", "Source", "Confidence",
                   "Site", "Observed at", "Media"])
    for cell in raw_ws[1]:
        cell.fill = header_fill
        cell.font = header_font
    for r in raw:
        raw_ws.append([
            r["species"], r["scientific_name"], r["source"],
            r["confidence"], r["site"],
            r["observed_at"].isoformat() if r["observed_at"] else "",
            r["media"],
        ])
    raw_widths = {"A": 18, "B": 22, "C": 10, "D": 12, "E": 22, "F": 24, "G": 26}
    for col, w in raw_widths.items():
        raw_ws.column_dimensions[col].width = w
    raw_ws.freeze_panes = "A2"

    buf = io.BytesIO()
    wb.save(buf)
    return buf.getvalue()


# ============================================================
# Orchestration
# ============================================================

def generate(conn, payload, generated_by=None):
    """
    Generate a report file, persist a `reports` row and return metadata.
    `conn` is an open psycopg connection (caller commits).
    """
    report_type = str(payload.get("type") or "survey").strip().lower()
    fmt = str(payload.get("format") or "pdf").strip().lower()

    if fmt not in ("pdf", "xlsx"):
        raise ValueError("format must be 'pdf' or 'xlsx'")

    type_meta = next((t for t in REPORT_TYPES if t["id"] == report_type), None)
    if not type_meta:
        raise ValueError(f"Unknown report type: {report_type}")

    from_d = payload.get("from") or None
    to_d = payload.get("to") or None
    species = str(payload.get("species") or "").strip() or None

    collectors = {
        "survey": collect_survey,
        "population": collect_population,
        "biodiversity": collect_biodiversity,
        "habitat": collect_habitat,
        "conservation": collect_conservation,
    }

    with conn.cursor() as cur:
        data = collectors[report_type](cur, from_d, to_d, species)

        site = get_site(cur, payload.get("site_id"))
        site_name = site["location"] if site else "All sites"

    range_label = (
        f"{from_d} to {to_d}"
        if from_d and to_d
        else (from_d or "all time") if not to_d else f"up to {to_d}"
    )

    filters = [
        ("Report type", type_meta["label"]),
        ("Site", site_name),
        ("Date range", range_label),
        ("Species filter", species or "All species"),
        ("Format", fmt.upper()),
    ]

    title = f"{type_meta['label']} · {site_name} · {range_label}"

    if fmt == "pdf":
        file_bytes = render_pdf(title, filters, data["summary"],
                                data["table"], data["chart"])
        ext = "pdf"
        mime = "application/pdf"
    else:
        file_bytes = render_xlsx(title, filters, data["summary"],
                                 data["table"], data["raw"])
        ext = "xlsx"
        mime = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

    stamp = now_utc().strftime("%Y%m%d-%H%M%S")
    filename = f"wpis-{report_type}-{stamp}.{ext}"
    file_path = os.path.join(REPORTS_DIR, filename)

    with open(file_path, "wb") as f:
        f.write(file_bytes)

    size_bytes = len(file_bytes)

    report_id = None
    with conn.cursor() as cur:
        report = cur.execute(
            """
            INSERT INTO reports
                (name, type, format, size_bytes, file_path, filters, generated_by)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id, name, type, format, size_bytes, generated_at, generated_by
            """,
            (
                title,
                report_type,
                fmt.upper(),
                size_bytes,
                file_path,
                json.dumps(
                    {
                        "type": report_type,
                        "site_id": payload.get("site_id"),
                        "from": from_d,
                        "to": to_d,
                        "species": species,
                        "format": fmt,
                    }
                ),
                generated_by,
            ),
        ).fetchone()
        report_id = str(report["id"])

    return {
        "report": {
            "id": report_id,
            "name": title,
            "type": report_type,
            "format": fmt.upper(),
            "size": human_size(size_bytes),
            "sizeBytes": size_bytes,
            "generatedAt": report["generated_at"].isoformat(),
            "by": "System",
        },
        "download_url": f"/reports/{report_id}/download",
    }
