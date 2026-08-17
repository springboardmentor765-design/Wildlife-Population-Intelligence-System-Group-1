from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app import models, schemas
from app.deps import get_current_user
from app.services.intelligence import estimate_trends

router = APIRouter(prefix="/population", tags=["Population Estimation Service"])


@router.get("", response_model=List[schemas.PopulationOut])
def list_population(
    species_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 200,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_current_user),
):
    q = db.query(models.Population).options(joinedload(models.Population.species))
    if species_id:
        q = q.filter(models.Population.species_id == species_id)
    return q.order_by(models.Population.observation_date.desc()).offset(skip).limit(limit).all()


@router.post("", response_model=schemas.PopulationOut, status_code=201)
def create_population(
    payload: schemas.PopulationCreate,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_current_user),
):
    species = db.query(models.Species).filter(models.Species.species_id == payload.species_id).first()
    if not species:
        raise HTTPException(status_code=404, detail="Species not found")
    record = models.Population(**payload.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/trends")
def population_trends(db: Session = Depends(get_db), _: models.User = Depends(get_current_user)):
    return estimate_trends(db)
