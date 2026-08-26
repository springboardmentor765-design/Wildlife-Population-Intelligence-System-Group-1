from datetime import UTC, date, datetime
from pathlib import Path
from uuid import uuid4
from fastapi import HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.image import Image
from app.models.image_detection import ImageDetection
from app.models.population import Population
from app.models.species import Species
from app.repositories.images import ImageRepository
from app.services.model_inference import ModelUnavailableError, predict_image
import logging

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
ROOT = Path(__file__).resolve().parents[2] / "uploads" / "images"
logger = logging.getLogger(__name__)

class ImageService:
    repo = ImageRepository()
    async def upload(self, db: Session, user_id: int, file: UploadFile, location: str | None, latitude: float | None, longitude: float | None) -> Image:
        suffix = Path(file.filename or "").suffix.lower()
        if suffix not in IMAGE_EXTENSIONS: raise HTTPException(400, "Supported image formats: jpg, jpeg, png, webp")
        ROOT.mkdir(parents=True, exist_ok=True); filename = f"{uuid4().hex}{suffix}"; destination = ROOT / filename
        contents = await file.read()
        if not contents: raise HTTPException(400, "The uploaded file is empty")
        destination.write_bytes(contents)
        annotated = ROOT / f"{uuid4().hex}_annotated.jpg"
        try:
            predictions = predict_image(str(destination), str(annotated))
        except ModelUnavailableError as error:
            destination.unlink(missing_ok=True)
            raise HTTPException(503, str(error)) from error
        except Exception as error:
            destination.unlink(missing_ok=True); annotated.unlink(missing_ok=True)
            logger.exception("Image inference failed for %s", destination)
            raise HTTPException(422, f"Image inference failed: {error}") from error
        top = max(predictions, key=lambda item: item.confidence, default=None)
        species = self._species_for_prediction(db, top.species_name) if top else None
        record = Image(user_id=user_id, file_name=file.filename or filename, file_path=str(destination), annotated_path=str(annotated) if annotated.exists() else None, location=location, latitude=latitude, longitude=longitude, species_id=species.id if species else None, confidence=top.confidence if top else 0.0, animal_count=len(predictions), status="Verified" if predictions else "No detections", processed_at=datetime.now(UTC))
        db.add(record)
        db.flush()
        for prediction in predictions:
            detected_species = species if prediction.species_name == top.species_name else self._species_for_prediction(db, prediction.species_name)
            detection = ImageDetection(image_id=record.id, species_id=detected_species.id, class_id=prediction.class_id, confidence=prediction.confidence, bbox=prediction.bbox)
            db.add(detection); db.flush()
            db.add(Population(species_id=detected_species.id, population_count=1, location=location or "Unspecified", latitude=latitude, longitude=longitude, confidence=prediction.confidence, observation_date=date.today(), source="image", image_detection_id=detection.id))
        db.commit()
        return self.repo.get(db, record.id)

    @staticmethod
    def _species_for_prediction(db: Session, name: str) -> Species:
        species = db.scalar(select(Species).where(Species.common_name.ilike(name)))
        if species:
            return species
        # The model supplies only a common label.  Create a reviewable entry so
        # detections, species totals, and population metrics stay connected.
        species = Species(common_name=name.strip(), scientific_name=f"Model label: {name.strip()}"[:200], species_group="Unclassified", iucn_status="Not assessed", description="Created automatically from a model detection; taxonomy requires review.")
        db.add(species)
        db.flush()
        return species
