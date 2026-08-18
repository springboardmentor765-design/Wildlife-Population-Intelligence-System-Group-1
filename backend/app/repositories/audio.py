from sqlalchemy import Select, select
from sqlalchemy.orm import Session, selectinload
from app.models.audio import Audio


class AudioRepository:
    def list(self, db: Session, search: str | None, species_id: int | None, status: str | None, location: str | None, skip: int, limit: int) -> list[Audio]:
        query: Select = select(Audio).options(selectinload(Audio.species))
        if search: query = query.where(Audio.file_name.ilike(f"%{search}%"))
        if species_id: query = query.where(Audio.species_id == species_id)
        if status: query = query.where(Audio.status == status)
        if location: query = query.where(Audio.location.ilike(f"%{location}%"))
        return list(db.scalars(query.order_by(Audio.created_at.desc()).offset(skip).limit(limit)))
    def get(self, db: Session, item_id: int) -> Audio | None: return db.scalar(select(Audio).options(selectinload(Audio.species)).where(Audio.id == item_id))
    def save(self, db: Session, item: Audio) -> Audio: db.add(item); db.commit(); db.refresh(item); return item
    def delete(self, db: Session, item: Audio) -> None: db.delete(item); db.commit()
