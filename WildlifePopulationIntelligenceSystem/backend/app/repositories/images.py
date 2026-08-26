from sqlalchemy import Select, or_, select
from sqlalchemy.orm import Session, selectinload
from app.models.image import Image
from app.models.image_detection import ImageDetection


class ImageRepository:
    def list(self, db: Session, search: str | None, species_id: int | None, status: str | None, location: str | None, skip: int, limit: int) -> list[Image]:
        query: Select = select(Image).options(selectinload(Image.species), selectinload(Image.detections).selectinload(ImageDetection.species))
        if search: query = query.where(Image.file_name.ilike(f"%{search}%"))
        if species_id: query = query.where(Image.species_id == species_id)
        if status: query = query.where(Image.status == status)
        if location: query = query.where(Image.location.ilike(f"%{location}%"))
        return list(db.scalars(query.order_by(Image.created_at.desc()).offset(skip).limit(limit)))
    def get(self, db: Session, item_id: int) -> Image | None: return db.scalar(select(Image).options(selectinload(Image.species), selectinload(Image.detections).selectinload(ImageDetection.species)).where(Image.id == item_id))
    def save(self, db: Session, item: Image) -> Image: db.add(item); db.commit(); db.refresh(item); return item
    def delete(self, db: Session, item: Image) -> None: db.delete(item); db.commit()
