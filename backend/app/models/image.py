from datetime import datetime
from sqlalchemy import DateTime, Float, ForeignKey, Integer, String
from pathlib import Path
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base
from app.utils.helpers import utc_now


class Image(Base):
    __tablename__ = "images"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    file_name: Mapped[str] = mapped_column(String(255))
    file_path: Mapped[str] = mapped_column(String(500))
    annotated_path: Mapped[str | None] = mapped_column(String(500), nullable=True)
    species_id: Mapped[int | None] = mapped_column(ForeignKey("species.id"), nullable=True)
    animal_count: Mapped[int | None] = mapped_column(Integer, nullable=True)
    confidence: Mapped[float | None] = mapped_column(Float, nullable=True)
    location: Mapped[str | None] = mapped_column(String(255), nullable=True)
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="Queued")
    observed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    processed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    user: Mapped["User"] = relationship(back_populates="images")
    species: Mapped["Species | None"] = relationship(back_populates="images")
    detections: Mapped[list["ImageDetection"]] = relationship(back_populates="image", cascade="all, delete-orphan")

    @property
    def annotated_image_url(self) -> str | None:
        return f"/uploads/images/{Path(self.annotated_path).name}" if self.annotated_path else None
