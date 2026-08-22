from fastapi import APIRouter, Depends, File, Query, Response, UploadFile
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.dependencies.auth import get_current_user, require_roles
from app.models.user import User
from app.schemas.audio import AudioResponse
from app.services.audio_service import AudioService

router = APIRouter(prefix="/audio", tags=["audio detections"]); service = AudioService()
@router.post("/upload", response_model=AudioResponse, status_code=201)
async def upload(file: UploadFile = File(...), location: str | None = None, latitude: float | None = None, longitude: float | None = None, db: Session = Depends(get_db), user: User = Depends(require_roles("admin", "researcher", "forest_officer"))): return await service.upload(db, user.id, file, location, latitude, longitude)
@router.get("/recent", response_model=list[AudioResponse])
def recent(db: Session = Depends(get_db), _: User = Depends(get_current_user)): return service.repo.list(db, None, None, None, None, 0, 10)
@router.get("", response_model=list[AudioResponse])
def list_audio(search: str | None = None, species_id: int | None = None, status: str | None = None, location: str | None = None, skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=100), db: Session = Depends(get_db), _: User = Depends(get_current_user)): return service.repo.list(db, search, species_id, status, location, skip, limit)
@router.get("/{item_id}", response_model=AudioResponse)
def get_audio(item_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)): return service.get(db, item_id)
@router.delete("/{item_id}", status_code=204)
def delete_audio(item_id: int, db: Session = Depends(get_db), _: User = Depends(require_roles("admin", "researcher", "forest_officer"))): service.repo.delete(db, service.get(db, item_id)); return Response(status_code=204)
