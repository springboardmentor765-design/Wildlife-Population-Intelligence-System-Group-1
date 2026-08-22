from sqlalchemy import Select, select
from sqlalchemy.orm import Session, selectinload
from app.models.population import Population


class PopulationRepository:
    def list(self, db: Session, species_id: int | None, location: str | None, skip: int, limit: int) -> list[Population]:
        query: Select = select(Population).options(selectinload(Population.species))
        if species_id: query = query.where(Population.species_id == species_id)
        if location: query = query.where(Population.location.ilike(f"%{location}%"))
        return list(db.scalars(query.order_by(Population.observation_date.desc()).offset(skip).limit(limit)))
    def get(self, db: Session, item_id: int) -> Population | None:
        return db.scalar(select(Population).options(selectinload(Population.species)).where(Population.id == item_id))
    def save(self, db: Session, item: Population) -> Population: db.add(item); db.commit(); db.refresh(item); return item
    def delete(self, db: Session, item: Population) -> None: db.delete(item); db.commit()
