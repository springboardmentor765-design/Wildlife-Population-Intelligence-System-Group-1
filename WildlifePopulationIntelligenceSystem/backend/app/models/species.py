from datetime import datetime
from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base
from app.utils.helpers import utc_now


class Species(Base):
    __tablename__ = "species"
    id: Mapped[int] = mapped_column(primary_key=True)
    common_name: Mapped[str] = mapped_column(String(160), index=True)
    scientific_name: Mapped[str] = mapped_column(String(200), unique=True)
    species_group: Mapped[str] = mapped_column(String(80), index=True)
    iucn_status: Mapped[str] = mapped_column(String(80), index=True)
    description: Mapped[str | None] = mapped_column(String(2000), nullable=True)
    habitat: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    diet: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)
    images: Mapped[list["Image"]] = relationship(back_populates="species")
    image_detections: Mapped[list["ImageDetection"]] = relationship(back_populates="species")
    audio_records: Mapped[list["Audio"]] = relationship(back_populates="species")
    populations: Mapped[list["Population"]] = relationship(back_populates="species")
