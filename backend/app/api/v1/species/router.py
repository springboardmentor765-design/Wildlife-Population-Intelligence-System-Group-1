from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.dependencies.auth import get_current_user, require_roles
from app.models.user import User
from app.schemas.species import SpeciesCreate, SpeciesResponse, SpeciesUpdate
from app.services.species_service import SpeciesService

router = APIRouter(prefix="/species", tags=["species"]); service = SpeciesService()
@router.get("", response_model=list[SpeciesResponse])
def list_species(search: str | None = None, iucn_status: str | None = None, species_group: str | None = None, skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=100), db: Session = Depends(get_db), _: User = Depends(get_current_user)): return service.repo.list(db, search, iucn_status, species_group, skip, limit)
@router.get("/{item_id}", response_model=SpeciesResponse)
def get_species(item_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)): return service.get(db, item_id)
@router.post("", response_model=SpeciesResponse, status_code=201)
def create_species(data: SpeciesCreate, db: Session = Depends(get_db), _: User = Depends(require_roles("admin", "researcher", "forest_officer"))): return service.create(db, data)
@router.put("/{item_id}", response_model=SpeciesResponse)
def update_species(item_id: int, data: SpeciesUpdate, db: Session = Depends(get_db), _: User = Depends(require_roles("admin", "researcher", "forest_officer"))): return service.update(db, item_id, data)
@router.delete("/{item_id}", status_code=204)
def delete_species(item_id: int, db: Session = Depends(get_db), _: User = Depends(require_roles("admin"))): service.repo.delete(db, service.get(db, item_id)); return Response(status_code=204)
