from datetime import date, datetime
from sqlalchemy import Date, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base
from app.utils.helpers import utc_now


class Population(Base):
    __tablename__ = "population"
    id: Mapped[int] = mapped_column(primary_key=True)
    species_id: Mapped[int] = mapped_column(ForeignKey("species.id"), index=True)
    population_count: Mapped[int] = mapped_column(Integer)
    location: Mapped[str] = mapped_column(String(255), index=True)
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    confidence: Mapped[float | None] = mapped_column(Float, nullable=True)
    observation_date: Mapped[date] = mapped_column(Date, index=True)
    source: Mapped[str] = mapped_column(String(32))
    image_detection_id: Mapped[int | None] = mapped_column(ForeignKey("image_detections.id", ondelete="CASCADE"), unique=True, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    species: Mapped["Species"] = relationship(back_populates="populations")
