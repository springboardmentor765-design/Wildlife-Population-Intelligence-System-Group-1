from sqlalchemy import Select, func, or_, select
from sqlalchemy.orm import Session
from app.models.species import Species


class SpeciesRepository:
    def list(self, db: Session, search: str | None, iucn_status: str | None, species_group: str | None, skip: int, limit: int) -> list[Species]:
        query: Select = select(Species)
        if search:
            term = f"%{search}%"; query = query.where(or_(Species.common_name.ilike(term), Species.scientific_name.ilike(term)))
        if iucn_status: query = query.where(Species.iucn_status == iucn_status)
        if species_group: query = query.where(Species.species_group == species_group)
        return list(db.scalars(query.order_by(Species.common_name).offset(skip).limit(limit)))
    def get(self, db: Session, item_id: int) -> Species | None: return db.get(Species, item_id)
    def scientific_name_exists(self, db: Session, name: str, exclude_id: int | None = None) -> bool:
        query = select(func.count()).select_from(Species).where(Species.scientific_name == name)
        if exclude_id: query = query.where(Species.id != exclude_id)
        return bool(db.scalar(query))
    def save(self, db: Session, item: Species) -> Species: db.add(item); db.commit(); db.refresh(item); return item
    def delete(self, db: Session, item: Species) -> None: db.delete(item); db.commit()
