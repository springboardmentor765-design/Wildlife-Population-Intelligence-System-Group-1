from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session
from app.models.population import Population
from app.models.species import Species
from app.repositories.population import PopulationRepository
from app.schemas.population import PopulationCreate, PopulationUpdate

class PopulationService:
    repo = PopulationRepository()
    def get(self, db: Session, item_id: int) -> Population:
        item = self.repo.get(db, item_id)
        if not item: raise HTTPException(status.HTTP_404_NOT_FOUND, "Population observation not found")
        return item
    def create(self, db: Session, data: PopulationCreate) -> Population:
        if not db.get(Species, data.species_id): raise HTTPException(status.HTTP_404_NOT_FOUND, "Species not found")
        if data.source not in {"image", "audio", "manual"}: raise HTTPException(422, "source must be image, audio, or manual")
        return self.repo.save(db, Population(**data.model_dump()))
    def update(self, db: Session, item_id: int, data: PopulationUpdate) -> Population:
        item = self.get(db, item_id); changes = data.model_dump(exclude_unset=True)
        if "species_id" in changes and not db.get(Species, changes["species_id"]): raise HTTPException(404, "Species not found")
        if "source" in changes and changes["source"] not in {"image", "audio", "manual"}: raise HTTPException(422, "source must be image, audio, or manual")
        for field, value in changes.items(): setattr(item, field, value)
        return self.repo.save(db, item)
    def summary(self, db: Session) -> dict:
        total = db.scalar(select(func.coalesce(func.sum(Population.population_count), 0))) or 0
        by_species = db.execute(select(Species.common_name, func.sum(Population.population_count)).join(Population).group_by(Species.id, Species.common_name).order_by(func.sum(Population.population_count).desc())).all()
        trends = db.execute(select(func.date_trunc("month", Population.observation_date).label("month"), func.sum(Population.population_count)).group_by("month").order_by("month")).all()
        return {"total_population": total, "number_of_species": db.scalar(select(func.count(func.distinct(Population.species_id)))) or 0, "population_by_species": [{"species": row[0], "population": row[1]} for row in by_species], "recent_observations": self.repo.list(db, None, None, 0, 10), "population_trend_data": [{"month": str(row[0].date()), "population": row[1]} for row in trends]}
