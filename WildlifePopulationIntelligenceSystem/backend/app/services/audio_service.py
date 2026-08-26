from datetime import UTC, datetime
from pathlib import Path
from uuid import uuid4
from fastapi import HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.audio import Audio
from app.models.species import Species
from app.repositories.audio import AudioRepository
from app.services.model_inference import ModelUnavailableError, common_name_for_label, predict_audio

AUDIO_EXTENSIONS = {".wav", ".mp3", ".m4a", ".ogg"}
ROOT = Path(__file__).resolve().parents[2] / "uploads" / "audio"

class AudioService:
    repo = AudioRepository()
    async def upload(self, db: Session, user_id: int, file: UploadFile, location: str | None, latitude: float | None, longitude: float | None) -> Audio:
        suffix = Path(file.filename or "").suffix.lower()
        if suffix not in AUDIO_EXTENSIONS: raise HTTPException(400, "Supported audio formats: wav, mp3, m4a, ogg")
        ROOT.mkdir(parents=True, exist_ok=True); filename = f"{uuid4().hex}{suffix}"; destination = ROOT / filename
        contents = await file.read()
        if not contents: raise HTTPException(400, "The uploaded file is empty")
        destination.write_bytes(contents)
        try:
            name, confidence = predict_audio(str(destination))
        except ModelUnavailableError as error:
            destination.unlink(missing_ok=True)
            raise HTTPException(503, str(error)) from error
        except Exception as error:
            raise HTTPException(422, f"Audio inference failed: {error}") from error
        species = self._species_for_prediction(db, common_name_for_label(name)) if name else None
        record = Audio(user_id=user_id, file_name=file.filename or filename, file_path=str(destination), location=location, latitude=latitude, longitude=longitude, species_id=species.id if species else None, confidence=confidence, status="Verified" if name else "No detections", processed_at=datetime.now(UTC))
        db.add(record)
        db.commit()
        db.refresh(record)
        return record

    @staticmethod
    def _species_for_prediction(db: Session, name: str) -> Species:
        species = db.scalar(select(Species).where(Species.common_name.ilike(name)))
        if species:
            return species
        species = Species(common_name=name.strip(), scientific_name=f"Model label: {name.strip()}"[:200], species_group="Unclassified", iucn_status="Not assessed", description="Created automatically from a model detection; taxonomy requires review.")
        db.add(species)
        db.flush()
        return species
