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
from app.config import AUDIO_UPLOAD_DIR, BASE_DIR, settings
from app.ml.inference import predict_from_audio

router = APIRouter(prefix="/audio", tags=["Audio Ingestion & Bioacoustic Analysis"])

ALLOWED = {"audio/mpeg", "audio/wav", "audio/x-wav", "audio/wave", "audio/mp4", "audio/ogg", "audio/webm"}


@router.post("/upload", response_model=schemas.AudioOut, status_code=201)
async def upload_audio(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    contents = await file.read()
    if len(contents) / (1024 * 1024) > settings.MAX_AUDIO_SIZE_MB:
        raise HTTPException(status_code=400, detail=f"Audio exceeds {settings.MAX_AUDIO_SIZE_MB}MB")

    ext = Path(file.filename or "recording.wav").suffix or ".wav"
    stored = f"{uuid.uuid4().hex}{ext}"
    dest = AUDIO_UPLOAD_DIR / stored
    dest.write_bytes(contents)

    audio = models.Audio(
        user_id=current_user.user_id,
        audio_path=f"uploads/audio/{stored}",
    )
    db.add(audio)
    db.commit()
    db.refresh(audio)
    return audio


@router.post("/{audio_id}/analyze", response_model=schemas.AudioAnalysisResult)
def analyze_audio(
    audio_id: int,
    create_population_record: bool = True,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_current_user),
):
    audio = db.query(models.Audio).filter(models.Audio.audio_id == audio_id).first()
    if not audio:
        raise HTTPException(status_code=404, detail="Audio not found")

    species_pool = db.query(models.Species).all()
    if not species_pool:
        raise HTTPException(status_code=400, detail="No species catalog loaded. Run the seed script.")

    filename = Path(audio.audio_path).name
    full_path = BASE_DIR / audio.audio_path
    size = full_path.stat().st_size if full_path.exists() else 44000
    try:
        prediction = predict_from_audio(
            filename, size, species_pool, audio_path=full_path if full_path.exists() else None
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Audio model failed: {exc}") from exc
    from app.ml.species_map import ensure_species

    detected = prediction.get("detected_label")
    species = prediction.get("species")
    if detected and species is None:
        species = ensure_species(db, detected, species_pool)
    if species is None:
        raise HTTPException(status_code=500, detail="Audio model returned no species label")

    audio.species_id = species.species_id
    audio.confidence = prediction["confidence"]
    audio.duration = prediction["duration"]

    population_record_id = None
    if create_population_record:
        pop = models.Population(
            species_id=species.species_id,
            audio_id=audio.audio_id,
            population_count=1,
            observation_date=date.today(),
        )
        db.add(pop)
        db.flush()
        population_record_id = pop.population_id

    db.commit()
    return schemas.AudioAnalysisResult(
        audio_id=audio.audio_id,
        species_id=species.species_id,
        species_common_name=species.common_name,
        scientific_name=species.scientific_name,
        confidence=prediction["confidence"],
        duration=prediction["duration"],
        spectrogram_peaks=prediction["spectrogram_peaks"],
        population_record_id=population_record_id,
        audio_path=audio.audio_path,
        model=prediction.get("model"),
        backend=prediction.get("backend"),
        top_predictions=prediction.get("top_predictions") or [],
    )


@router.get("", response_model=List[schemas.AudioOut])
def list_audio(
    species_id: Optional[int] = None,
    mine_only: bool = False,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    q = db.query(models.Audio).options(joinedload(models.Audio.species))
    if species_id:
        q = q.filter(models.Audio.species_id == species_id)
    if mine_only:
        q = q.filter(models.Audio.user_id == current_user.user_id)
    return q.order_by(models.Audio.uploaded_at.desc()).offset(skip).limit(limit).all()


@router.get("/{audio_id}/file")
def get_audio_file(audio_id: int, db: Session = Depends(get_db), _: models.User = Depends(get_current_user)):
    audio = db.query(models.Audio).filter(models.Audio.audio_id == audio_id).first()
    if not audio:
        raise HTTPException(status_code=404, detail="Audio not found")
    full_path = BASE_DIR / audio.audio_path
    if not full_path.exists():
        raise HTTPException(status_code=404, detail="Audio file missing on disk")
    return FileResponse(full_path)


@router.delete("/{audio_id}", status_code=204)
def delete_audio(
    audio_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    audio = db.query(models.Audio).filter(models.Audio.audio_id == audio_id).first()
    if not audio:
        raise HTTPException(status_code=404, detail="Audio not found")
    if audio.user_id != current_user.user_id and current_user.role != "administrator":
        raise HTTPException(status_code=403, detail="Not allowed")
    db.query(models.Population).filter(models.Population.audio_id == audio_id).delete()
    path = BASE_DIR / audio.audio_path
    if path.exists():
        path.unlink()
    db.delete(audio)
    db.commit()
