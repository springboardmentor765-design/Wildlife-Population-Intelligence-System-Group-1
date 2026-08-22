from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.schemas.species import SpeciesResponse


class ImageDetectionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    species_id: int
    class_id: int
    confidence: float
    bbox: list[float]
    created_at: datetime
    species: SpeciesResponse


class ImageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    species_id: int | None
    file_name: str
    annotated_image_url: str | None = None
    animal_count: int | None
    confidence: float | None
    location: str | None
    latitude: float | None
    longitude: float | None
    status: str
    observed_at: datetime | None
    created_at: datetime
    processed_at: datetime | None
    species: SpeciesResponse | None = None
    detections: list[ImageDetectionResponse] = []
