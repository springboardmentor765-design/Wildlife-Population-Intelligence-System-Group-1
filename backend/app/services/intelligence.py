from datetime import date
from collections import defaultdict

from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func

from app import models


def estimate_trends(db: Session) -> dict:
    """Daily summed field counts from image/audio detections (and manual records)."""
    rows = (
        db.query(models.Population, models.Species)
        .join(models.Species, models.Population.species_id == models.Species.species_id)
        .order_by(models.Population.observation_date.asc())
        .all()
    )
    by_species: dict[str, dict[str, int]] = defaultdict(lambda: defaultdict(int))
    totals: dict[str, int] = defaultdict(int)
    for pop, species in rows:
        if not pop.observation_date:
            continue
        day = pop.observation_date.isoformat()
        by_species[species.common_name][day] += int(pop.population_count or 0)
        totals[species.common_name] += int(pop.population_count or 0)

    series = []
    for name, by_date in by_species.items():
        points = [{"date": day, "count": count} for day, count in sorted(by_date.items())]
        if len(points) >= 2:
            change = points[-1]["count"] - points[0]["count"]
            pct = round((change / max(points[0]["count"], 1)) * 100, 1)
        else:
            change, pct = 0, 0.0
        series.append(
            {
                "species": name,
                "latest": totals[name],
                "change": change,
                "percent_change": pct,
                "trend": "declining" if pct < -5 else "increasing" if pct > 5 else "stable",
                "points": points[-12:],
            }
        )
    series.sort(key=lambda s: s["latest"], reverse=True)
    return {"series": series, "method": "field-counts"}


def biodiversity_metrics(db: Session) -> dict:
    species = db.query(models.Species).all()
    groups: dict[str, int] = defaultdict(int)
    iucn: dict[str, int] = defaultdict(int)
    for s in species:
        groups[s.species_group or "Unknown"] += 1
        iucn[s.iucn_status or "NE"] += 1

    threatened = sum(iucn.get(k, 0) for k in ("VU", "EN", "CR"))
    richness = len(species)
    evenness = round(1 - (max(groups.values()) / richness) if richness else 0, 3)
    shannon = round(min(2.8, 0.4 + richness * 0.12), 2)
    return {
        "species_richness": richness,
        "shannon_index": shannon,
        "evenness": evenness,
        "threatened_count": threatened,
        "groups": dict(groups),
        "iucn": dict(iucn),
    }


FIELD_LANDSCAPES = [
    {"name": "Sundarbans", "lat": 21.9497, "lng": 89.1833, "habitat": "Mangrove"},
    {"name": "Bandhavgarh", "lat": 23.7167, "lng": 81.0167, "habitat": "Tropical dry forest"},
    {"name": "Kaziranga", "lat": 26.5775, "lng": 93.1711, "habitat": "Floodplain grassland"},
    {"name": "Periyar", "lat": 9.4669, "lng": 77.1750, "habitat": "Evergreen forest"},
    {"name": "Jim Corbett", "lat": 29.5300, "lng": 78.7747, "habitat": "Sal forest / riverine"},
    {"name": "Gir", "lat": 21.1240, "lng": 70.8242, "habitat": "Dry deciduous"},
    {"name": "Ranthambore", "lat": 26.0173, "lng": 76.5026, "habitat": "Dry forest / lakes"},
    {"name": "Nagarhole", "lat": 12.0594, "lng": 76.1511, "habitat": "Moist deciduous"},
]


def _surveys_for_site(site_name: str, surveys: list) -> list:
    needle = (site_name or "").strip().lower()
    if not needle:
        return []
    matched = []
    for survey in surveys:
        loc = (survey.location or "").strip().lower()
        if loc == needle or needle in loc or loc in needle:
            matched.append(survey)
    return matched


def _habitat_from_surveys(site: dict, surveys: list) -> dict:
    if not surveys:
        return {
            **site,
            "score": 0.0,
            "predicted_occupancy": 0.0,
            "model": "field-surveys",
            "survey_count": 0,
            "species_records": 0,
            "last_survey": None,
            "status": "unsurveyed",
        }
    species_records = sum(int(s.species_count or 0) for s in surveys)
    completed = sum(1 for s in surveys if (s.status or "") == "Completed")
    in_progress = sum(1 for s in surveys if (s.status or "") == "In Progress")
    dates = [s.survey_date for s in surveys if s.survey_date]
    last = max(dates) if dates else None
    recency_days = (date.today() - last).days if last else 365
    recency = max(0.0, 1.0 - recency_days / 180.0)
    effort = min(1.0, (completed + 0.5 * in_progress + 0.25 * len(surveys)) / 3.0)
    richness = min(1.0, species_records / 30.0)
    score = round(min(0.99, 0.2 + 0.45 * richness + 0.25 * effort + 0.1 * recency), 2)
    occupancy = round(min(0.99, 0.15 + 0.55 * richness + 0.3 * effort), 2)
    return {
        **site,
        "score": score,
        "predicted_occupancy": occupancy,
        "model": "field-surveys",
        "survey_count": len(surveys),
        "species_records": species_records,
        "last_survey": last.isoformat() if last else None,
        "status": "monitored",
    }


def habitat_suitability(db: Session) -> list[dict]:
    surveys = db.query(models.Survey).all()
    used_ids: set[int] = set()
    results = []
    for park in FIELD_LANDSCAPES:
        matched = _surveys_for_site(park["name"], surveys)
        used_ids.update(s.survey_id for s in matched)
        results.append(_habitat_from_surveys(park, matched))

    extras: dict[str, list] = defaultdict(list)
    for survey in surveys:
        if survey.survey_id in used_ids:
            continue
        extras[(survey.location or "Field site").strip() or "Field site"].append(survey)
    for name, items in extras.items():
        first = items[0]
        results.append(
            _habitat_from_surveys(
                {
                    "name": name,
                    "lat": first.latitude,
                    "lng": first.longitude,
                    "habitat": "Field site",
                },
                items,
            )
        )
    return results


def conservation_actions(db: Session) -> list[dict]:
    threatened = (
        db.query(models.Species)
        .filter(models.Species.iucn_status.in_(["VU", "EN", "CR"]))
        .all()
    )
    actions = []
    for sp in threatened:
        priority = {"CR": "critical", "EN": "high", "VU": "medium"}[sp.iucn_status]
        actions.append(
            {
                "species_id": sp.species_id,
                "species": sp.common_name,
                "scientific_name": sp.scientific_name,
                "iucn_status": sp.iucn_status,
                "priority": priority,
                "recommendation": (
                    f"Expand anti-poaching patrols and corridor protection for {sp.common_name} "
                    f"({sp.scientific_name}). Prioritise habitat connectivity and prey-base recovery."
                ),
            }
        )
    if not actions:
        actions.append(
            {
                "species_id": None,
                "species": "All monitored taxa",
                "scientific_name": "—",
                "iucn_status": "LC",
                "priority": "low",
                "recommendation": "Continue routine monitoring and maintain current protection levels.",
            }
        )
    return actions


def health_scores(db: Session) -> dict:
    """Scores from field detections and surveys only — not the seeded species catalog."""
    observed = (
        db.query(models.Species)
        .join(models.Population, models.Population.species_id == models.Species.species_id)
        .distinct()
        .all()
    )
    detections = int(db.query(func.coalesce(func.sum(models.Population.population_count), 0)).scalar() or 0)
    days = int(db.query(func.count(func.distinct(models.Population.observation_date))).scalar() or 0)
    surveys = db.query(models.Survey).all()
    survey_records = sum(int(s.species_count or 0) for s in surveys)
    habitats = habitat_suitability(db)
    monitored = [h for h in habitats if h.get("survey_count")]

    if observed:
        threatened = sum(1 for s in observed if (s.iucn_status or "") in {"VU", "EN", "CR"})
        threat_ratio = threatened / len(observed)
        coverage = min(1.0, len(observed) / 8.0)
        biodiversity_score = round(max(0.0, (95 - threat_ratio * 45) * coverage), 1)
    elif survey_records:
        biodiversity_score = round(min(70.0, survey_records * 2.5), 1)
    else:
        biodiversity_score = 0.0

    if monitored:
        habitat_score = round(sum(h["score"] for h in monitored) / len(monitored) * 100, 1)
    else:
        habitat_score = 0.0

    if detections:
        volume = min(50.0, detections * 2.0)
        span = min(40.0, days * 8.0)
        trends = estimate_trends(db)["series"]
        multi_day = [t for t in trends if len(t.get("points") or []) >= 2]
        if multi_day:
            avg_shift = sum(abs(t["percent_change"]) for t in multi_day) / len(multi_day)
            stability = max(0.0, 30.0 - min(30.0, avg_shift / 2.0))
        else:
            stability = 0.0
        population_score = round(min(95.0, volume * 0.5 + span * 0.5 + stability * 0.5), 1)
    else:
        population_score = 0.0

    overall = round((biodiversity_score + habitat_score + population_score) / 3, 1)
    has_field = bool(observed or surveys or detections)
    if not has_field:
        status = "no-field-data"
    elif overall >= 70:
        status = "stable"
    elif overall >= 35:
        status = "watch"
    else:
        status = "low"
    return {
        "overall": overall,
        "biodiversity": biodiversity_score,
        "habitat": habitat_score,
        "population_stability": population_score,
        "status": status,
        "updated": date.today().isoformat(),
        "sources": {
            "species_detected": len(observed),
            "animal_counts": detections,
            "observation_days": days,
            "surveys": len(surveys),
            "surveyed_landscapes": len(monitored),
        },
    }


def dashboard_stats(db: Session) -> dict:
    species_n = db.query(func.count(models.Species.species_id)).scalar() or 0
    image_n = db.query(func.count(models.Image.image_id)).scalar() or 0
    audio_n = db.query(func.count(models.Audio.audio_id)).scalar() or 0
    survey_n = db.query(func.count(models.Survey.survey_id)).scalar() or 0
    total_obs = db.query(func.coalesce(func.sum(models.Population.population_count), 0)).scalar() or 0
    threatened = (
        db.query(func.count(models.Species.species_id))
        .filter(models.Species.iucn_status.in_(["VU", "EN", "CR"]))
        .scalar()
        or 0
    )
    recent = (
        db.query(models.Population)
        .order_by(models.Population.observation_date.desc())
        .limit(8)
        .all()
    )
    return {
        "species": species_n,
        "images": image_n,
        "audio": audio_n,
        "surveys": survey_n,
        "total_observations": int(total_obs),
        "threatened_species": threatened,
        "recent_observations": [
            {
                "population_id": r.population_id,
                "species_id": r.species_id,
                "count": r.population_count,
                "date": r.observation_date.isoformat(),
            }
            for r in recent
        ],
    }


def admin_overview(db: Session) -> dict:
    stats = dashboard_stats(db)
    role_rows = db.query(models.User.role, func.count(models.User.user_id)).group_by(models.User.role).all()
    users = db.query(models.User).order_by(models.User.created_at.desc()).all()
    image_counts = dict(
        db.query(models.Image.user_id, func.count(models.Image.image_id)).group_by(models.Image.user_id).all()
    )
    audio_counts = dict(
        db.query(models.Audio.user_id, func.count(models.Audio.audio_id)).group_by(models.Audio.user_id).all()
    )
    survey_counts = dict(
        db.query(models.Survey.created_by, func.count(models.Survey.survey_id)).group_by(models.Survey.created_by).all()
    )

    recent_images = (
        db.query(models.Image, models.User)
        .join(models.User, models.Image.user_id == models.User.user_id)
        .options(joinedload(models.Image.species))
        .order_by(models.Image.uploaded_at.desc())
        .limit(8)
        .all()
    )
    recent_audio = (
        db.query(models.Audio, models.User)
        .join(models.User, models.Audio.user_id == models.User.user_id)
        .options(joinedload(models.Audio.species))
        .order_by(models.Audio.uploaded_at.desc())
        .limit(8)
        .all()
    )
    recent_surveys = db.query(models.Survey).order_by(models.Survey.created_at.desc()).limit(8).all()

    return {
        **stats,
        "users": len(users),
        "by_role": {role: int(n) for role, n in role_rows},
        "accounts": [
            {
                "user_id": u.user_id,
                "name": u.name,
                "email": u.email,
                "role": u.role,
                "auth_provider": getattr(u, "auth_provider", None) or "local",
                "created_at": u.created_at.isoformat() if u.created_at else None,
                "image_count": int(image_counts.get(u.user_id, 0)),
                "audio_count": int(audio_counts.get(u.user_id, 0)),
                "survey_count": int(survey_counts.get(u.user_id, 0)),
            }
            for u in users
        ],
        "recent_images": [
            {
                "image_id": img.image_id,
                "user": user.name,
                "species": img.species.common_name if img.species else "Pending",
                "uploaded_at": img.uploaded_at.isoformat() if img.uploaded_at else None,
            }
            for img, user in recent_images
        ],
        "recent_audio": [
            {
                "audio_id": clip.audio_id,
                "user": user.name,
                "species": clip.species.common_name if clip.species else "Pending",
                "uploaded_at": clip.uploaded_at.isoformat() if clip.uploaded_at else None,
            }
            for clip, user in recent_audio
        ],
        "recent_surveys": [
            {
                "survey_id": s.survey_id,
                "title": s.title,
                "location": s.location,
                "status": s.status,
                "survey_date": s.survey_date.isoformat() if s.survey_date else None,
            }
            for s in recent_surveys
        ],
    }
