"""Map model class names onto rows in the Species catalog."""
from __future__ import annotations

from typing import Sequence

from sqlalchemy.orm import Session

from app import models

KEYWORD_MAP = {
    "tiger": "Bengal Tiger",
    "bengal": "Bengal Tiger",
    "panthera tigris": "Bengal Tiger",
    "elephant": "Asian Elephant",
    "elephas": "Asian Elephant",
    "rhino": "Indian Rhinoceros",
    "rhinoceros": "Indian Rhinoceros",
    "leopard": "Indian Leopard",
    "snow leopard": "Snow Leopard",
    "uncia": "Snow Leopard",
    "bear": "Sloth Bear",
    "sloth": "Sloth Bear",
    "ursidae": "Sloth Bear",
    "peacock": "Indian Peafowl",
    "peafowl": "Indian Peafowl",
    "pavo": "Indian Peafowl",
    "hornbill": "Great Hornbill",
    "gharial": "Gharial",
    "cobra": "King Cobra",
    "pangolin": "Indian Pangolin",
    "deer": "Chital",
    "chital": "Chital",
    "axis": "Chital",
    "gaur": "Indian Gaur",
    "bison": "Indian Gaur",
    "owl": "Spot-bellied Eagle-Owl",
    "eagle": "Crested Serpent Eagle",
    "wolf": "Gray Wolf",
    "canis lupus": "Gray Wolf",
    "fox": "Indian Fox",
    "langur": "Hanuman Langur",
    "macaque": "Rhesus Macaque",
    "cercopithecidae": "Rhesus Macaque",
    "crocodile": "Mugger Crocodile",
    "mugger": "Mugger Crocodile",
    "turtle": "Indian Star Tortoise",
    "tortoise": "Indian Star Tortoise",
    "lion": "Lion",
    "panthera leo": "Lion",
    "anura": "Frogs and toads",
}


def _norm(text: str) -> str:
    return " ".join(text.lower().replace("_", " ").replace("-", " ").split())


def match_species(label: str, species_pool: Sequence[models.Species]) -> models.Species | None:
    if not label or not species_pool:
        return None
    needle = _norm(label)

    for sp in species_pool:
        if _norm(sp.common_name) == needle or _norm(sp.scientific_name or "") == needle:
            return sp

    for sp in species_pool:
        common = _norm(sp.common_name)
        sci = _norm(sp.scientific_name or "")
        if needle in common or needle in sci or common in needle or (sci and sci in needle):
            return sp

    for key, common in KEYWORD_MAP.items():
        if key in needle:
            for sp in species_pool:
                if _norm(sp.common_name) == _norm(common):
                    return sp
    return None


def match_species_by_filename(filename: str, species_pool: Sequence[models.Species]) -> models.Species | None:
    return match_species(filename.replace("-", " ").replace("_", " "), species_pool)


def ensure_species(db: Session, label: str, species_pool: Sequence[models.Species] | None = None) -> models.Species:
    """Match a model label to Species, or insert a catalog row for unknown detections."""
    pool = list(species_pool) if species_pool is not None else db.query(models.Species).all()
    found = match_species(label, pool)
    if found:
        return found
    name = " ".join(label.replace("_", " ").split()).strip() or "Unknown"
    existing = (
        db.query(models.Species)
        .filter(
            (models.Species.common_name.ilike(name)) | (models.Species.scientific_name.ilike(name))
        )
        .first()
    )
    if existing:
        return existing
    species = models.Species(
        common_name=name,
        scientific_name=name,
        species_group="Unknown",
        iucn_status="NE",
    )
    db.add(species)
    db.flush()
    return species
