from datetime import datetime

from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)
    avatar_path = Column(String(500), nullable=True)
    auth_provider = Column(String(30), nullable=False, default="local")
    google_sub = Column(String(128), nullable=True, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    images = relationship("Image", back_populates="user")
    audio_files = relationship("Audio", back_populates="user")
    surveys = relationship("Survey", back_populates="creator")
    alerts = relationship("Alert", back_populates="user")


class Species(Base):
    __tablename__ = "species"

    species_id = Column(Integer, primary_key=True, index=True)
    common_name = Column(String(150), nullable=False)
    scientific_name = Column(String(150), nullable=False)
    species_group = Column(String(100))
    iucn_status = Column(String(50))

    populations = relationship("Population", back_populates="species")
    images = relationship("Image", back_populates="species")
    audio_files = relationship("Audio", back_populates="species")


class Image(Base):
    __tablename__ = "images"

    image_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    image_path = Column(String(500), nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    species_id = Column(Integer, ForeignKey("species.species_id"), nullable=True)
    animal_count = Column(Integer, nullable=True)
    confidence = Column(Float, nullable=True)

    user = relationship("User", back_populates="images")
    species = relationship("Species", back_populates="images")
    populations = relationship("Population", back_populates="image")


class Audio(Base):
    __tablename__ = "audio"

    audio_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    audio_path = Column(String(500), nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    species_id = Column(Integer, ForeignKey("species.species_id"), nullable=True)
    confidence = Column(Float, nullable=True)
    duration = Column(Float, nullable=True)

    user = relationship("User", back_populates="audio_files")
    species = relationship("Species", back_populates="audio_files")
    populations = relationship("Population", back_populates="audio")


class Population(Base):
    __tablename__ = "population"

    population_id = Column(Integer, primary_key=True, index=True)
    species_id = Column(Integer, ForeignKey("species.species_id"), nullable=False)
    image_id = Column(Integer, ForeignKey("images.image_id"), nullable=True)
    audio_id = Column(Integer, ForeignKey("audio.audio_id"), nullable=True)
    population_count = Column(Integer, nullable=False)
    observation_date = Column(Date, nullable=False)

    species = relationship("Species", back_populates="populations")
    image = relationship("Image", back_populates="populations")
    audio = relationship("Audio", back_populates="populations")


class Survey(Base):
    """Field survey records used by the Surveys module (extends the core schema)."""

    __tablename__ = "surveys"

    survey_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    location = Column(String(150), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    survey_date = Column(Date, nullable=False)
    status = Column(String(50), nullable=False, default="Pending")
    notes = Column(Text, nullable=True)
    species_count = Column(Integer, default=0)
    created_by = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    creator = relationship("User", back_populates="surveys")


class Alert(Base):
    """In-app notifications for the header bell."""

    __tablename__ = "alerts"

    alert_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    severity = Column(String(30), default="info")
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="alerts")
