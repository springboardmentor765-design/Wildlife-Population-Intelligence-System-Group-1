from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.dependencies.auth import get_current_user, require_roles
from app.models.user import User
from app.schemas.population import PopulationCreate, PopulationResponse, PopulationSummary, PopulationUpdate
from app.services.population_service import PopulationService

router = APIRouter(prefix="/population", tags=["population"]); service = PopulationService()
@router.get("/summary", response_model=PopulationSummary)
def summary(db: Session = Depends(get_db), _: User = Depends(get_current_user)): return service.summary(db)
@router.get("", response_model=list[PopulationResponse])
def list_population(species_id: int | None = None, location: str | None = None, skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=100), db: Session = Depends(get_db), _: User = Depends(get_current_user)): return service.repo.list(db, species_id, location, skip, limit)
@router.get("/{item_id}", response_model=PopulationResponse)
def get_population(item_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)): return service.get(db, item_id)
@router.post("", response_model=PopulationResponse, status_code=201)
def create_population(data: PopulationCreate, db: Session = Depends(get_db), _: User = Depends(require_roles("admin", "researcher", "forest_officer"))): return service.create(db, data)
@router.put("/{item_id}", response_model=PopulationResponse)
def update_population(item_id: int, data: PopulationUpdate, db: Session = Depends(get_db), _: User = Depends(require_roles("admin", "researcher", "forest_officer"))): return service.update(db, item_id, data)
@router.delete("/{item_id}", status_code=204)
def delete_population(item_id: int, db: Session = Depends(get_db), _: User = Depends(require_roles("admin", "researcher", "forest_officer"))): service.repo.delete(db, service.get(db, item_id)); return Response(status_code=204)
