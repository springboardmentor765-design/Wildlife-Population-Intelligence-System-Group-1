from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas
from app.deps import get_current_user, require_roles

router = APIRouter(prefix="/species", tags=["Species Identification Service"])


@router.get("", response_model=List[schemas.SpeciesOut])
def list_species(
    group: Optional[str] = None,
    iucn_status: Optional[str] = None,
    q: Optional[str] = None,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_current_user),
):
    query = db.query(models.Species)
    if group:
        query = query.filter(models.Species.species_group == group)
    if iucn_status:
        query = query.filter(models.Species.iucn_status == iucn_status)
    if q:
        like = f"%{q}%"
        query = query.filter(
            (models.Species.common_name.ilike(like)) | (models.Species.scientific_name.ilike(like))
        )
    return query.order_by(models.Species.common_name).all()


@router.get("/{species_id}", response_model=schemas.SpeciesOut)
def get_species(species_id: int, db: Session = Depends(get_db), _: models.User = Depends(get_current_user)):
    species = db.query(models.Species).filter(models.Species.species_id == species_id).first()
    if not species:
        raise HTTPException(status_code=404, detail="Species not found")
    return species


@router.post("", response_model=schemas.SpeciesOut, status_code=201)
def create_species(
    payload: schemas.SpeciesCreate,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_roles("researcher", "administrator", "forest_department")),
):
    species = models.Species(**payload.model_dump())
    db.add(species)
    db.commit()
    db.refresh(species)
    return species
