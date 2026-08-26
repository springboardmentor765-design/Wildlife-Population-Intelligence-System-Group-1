from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.schemas.species import SpeciesResponse


class AudioResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    species_id: int | None
    file_name: str
    duration: float | None
    confidence: float | None
    location: str | None
    latitude: float | None
    longitude: float | None
    status: str
    observed_at: datetime | None
    created_at: datetime
    processed_at: datetime | None
    species: SpeciesResponse | None = None
