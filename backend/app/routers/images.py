import uuid
from datetime import date
from pathlib import Path
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app import models, schemas
from app.deps import get_current_user
from app.config import IMAGE_UPLOAD_DIR, BASE_DIR, settings
from app.ml.inference import predict_from_image

router = APIRouter(prefix="/images", tags=["Image Ingestion & Analysis"])

ALLOWED = {"image/jpeg", "image/png", "image/webp", "image/jpg"}


@router.post("/upload", response_model=schemas.ImageOut, status_code=201)
async def upload_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if file.content_type and file.content_type not in ALLOWED and not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, or WEBP images are accepted")

    contents = await file.read()
    if len(contents) / (1024 * 1024) > settings.MAX_IMAGE_SIZE_MB:
        raise HTTPException(status_code=400, detail=f"Image exceeds {settings.MAX_IMAGE_SIZE_MB}MB")

    ext = Path(file.filename or "capture.jpg").suffix or ".jpg"
    stored = f"{uuid.uuid4().hex}{ext}"
    dest = IMAGE_UPLOAD_DIR / stored
    dest.write_bytes(contents)

    image = models.Image(
        user_id=current_user.user_id,
        image_path=f"uploads/images/{stored}",
    )
    db.add(image)
    db.commit()
    db.refresh(image)
    return image


@router.post("/{image_id}/analyze", response_model=schemas.ImageAnalysisResult)
def analyze_image(
    image_id: int,
    create_population_record: bool = True,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_current_user),
):
    image = db.query(models.Image).filter(models.Image.image_id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    species_pool = db.query(models.Species).all()
    if not species_pool:
        raise HTTPException(status_code=400, detail="No species catalog loaded. Run the seed script.")

    filename = Path(image.image_path).name
    full_path = BASE_DIR / image.image_path
    size = full_path.stat().st_size if full_path.exists() else 1000
    try:
        prediction = predict_from_image(
            filename, size, species_pool, image_path=full_path if full_path.exists() else None
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Image model failed: {exc}") from exc

    from app.ml.species_map import ensure_species

    detected = prediction.get("detected_label")
    species = prediction.get("species")
    if detected and species is None:
        species = ensure_species(db, detected, species_pool)

    if species:
        image.species_id = species.species_id
    image.animal_count = prediction["animal_count"]
    image.confidence = prediction["confidence"]

    population_record_id = None
    if create_population_record and species and prediction["animal_count"]:
        pop = models.Population(
            species_id=species.species_id,
            image_id=image.image_id,
            population_count=prediction["animal_count"],
            observation_date=date.today(),
        )
        db.add(pop)
        db.flush()
        population_record_id = pop.population_id

    db.commit()
    return schemas.ImageAnalysisResult(
        image_id=image.image_id,
        species_id=species.species_id if species else None,
        species_common_name=species.common_name if species else (detected or "No detection"),
        scientific_name=species.scientific_name if species else None,
        species_group=species.species_group if species else None,
        iucn_status=species.iucn_status if species else None,
        animal_count=prediction["animal_count"],
        confidence=prediction["confidence"],
        detections=prediction["detections"],
        population_record_id=population_record_id,
        image_path=image.image_path,
        model=prediction.get("model"),
        backend=prediction.get("backend"),
    )


@router.get("", response_model=List[schemas.ImageOut])
def list_images(
    species_id: Optional[int] = None,
    mine_only: bool = False,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    q = db.query(models.Image).options(joinedload(models.Image.species))
    if species_id:
        q = q.filter(models.Image.species_id == species_id)
    if mine_only:
        q = q.filter(models.Image.user_id == current_user.user_id)
    return q.order_by(models.Image.uploaded_at.desc()).offset(skip).limit(limit).all()


@router.get("/{image_id}", response_model=schemas.ImageOut)
def get_image(image_id: int, db: Session = Depends(get_db), _: models.User = Depends(get_current_user)):
    image = (
        db.query(models.Image)
        .options(joinedload(models.Image.species))
        .filter(models.Image.image_id == image_id)
        .first()
    )
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    return image


@router.get("/{image_id}/file")
def get_image_file(image_id: int, db: Session = Depends(get_db), _: models.User = Depends(get_current_user)):
    image = db.query(models.Image).filter(models.Image.image_id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    full_path = BASE_DIR / image.image_path
    if not full_path.exists():
        raise HTTPException(status_code=404, detail="Image file missing on disk")
    return FileResponse(full_path)


@router.delete("/{image_id}", status_code=204)
def delete_image(
    image_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    image = db.query(models.Image).filter(models.Image.image_id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    if image.user_id != current_user.user_id and current_user.role != "administrator":
        raise HTTPException(status_code=403, detail="Not allowed to delete this image")
    db.query(models.Population).filter(models.Population.image_id == image_id).delete()
    path = BASE_DIR / image.image_path
    if path.exists():
        path.unlink()
    db.delete(image)
    db.commit()
