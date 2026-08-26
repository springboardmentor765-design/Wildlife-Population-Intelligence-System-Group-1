from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.species import Species
from app.repositories.species import SpeciesRepository
from app.schemas.species import SpeciesCreate, SpeciesUpdate

class SpeciesService:
    repo = SpeciesRepository()
    def get(self, db: Session, item_id: int) -> Species:
        item = self.repo.get(db, item_id)
        if not item: raise HTTPException(status.HTTP_404_NOT_FOUND, "Species not found")
        return item
    def create(self, db: Session, data: SpeciesCreate) -> Species:
        if self.repo.scientific_name_exists(db, data.scientific_name): raise HTTPException(status.HTTP_409_CONFLICT, "Scientific name already exists")
        return self.repo.save(db, Species(**data.model_dump()))
    def update(self, db: Session, item_id: int, data: SpeciesUpdate) -> Species:
        item = self.get(db, item_id); changes = data.model_dump(exclude_unset=True)
        if "scientific_name" in changes and self.repo.scientific_name_exists(db, changes["scientific_name"], item_id): raise HTTPException(status.HTTP_409_CONFLICT, "Scientific name already exists")
        for field, value in changes.items(): setattr(item, field, value)
        return self.repo.save(db, item)
