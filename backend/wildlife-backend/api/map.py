from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.database import get_db
from database.models import Detection

router = APIRouter()

@router.get("/markers")
def get_map_markers(db: Session = Depends(get_db)):
    from database.models import AudioPrediction # Import here to avoid circular imports if any, or it's fine
    
    # Assuming location data is optionally populated
    detections = db.query(Detection).filter(Detection.location_lat.isnot(None)).all()
    audio_preds = db.query(AudioPrediction).filter(AudioPrediction.location_lat.isnot(None)).all()
    
    markers = []
    for d in detections:
        markers.append({
            "id": f"img_{d.id}",
            "position": [d.location_lat, d.location_lng],
            "title": f"{d.species_name} (Conf: {round(d.confidence, 2)}) - Camera",
            "image": d.image_path,
            "timestamp": d.timestamp
        })
        
    for a in audio_preds:
        markers.append({
            "id": f"audio_{a.id}",
            "position": [a.location_lat, a.location_lng],
            "title": f"{a.species_name} (Conf: {round(a.confidence, 2)}) - Audio",
            "image": None,
            "timestamp": a.created_at
        })
        
    return {"markers": markers}