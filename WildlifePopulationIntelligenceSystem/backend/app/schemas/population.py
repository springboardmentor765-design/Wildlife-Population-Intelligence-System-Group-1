from datetime import date, datetime
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.species import SpeciesResponse


class PopulationBase(BaseModel):
    species_id: int
    location: str = Field(min_length=2, max_length=255)
    latitude: float | None = None
    longitude: float | None = None
    population_count: int = Field(ge=0)
    confidence: float | None = Field(default=None, ge=0, le=1)
    observation_date: date
    source: str = "manual"


class PopulationCreate(PopulationBase): pass
class PopulationUpdate(BaseModel):
    species_id: int | None = None
    location: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    population_count: int | None = Field(default=None, ge=0)
    confidence: float | None = Field(default=None, ge=0, le=1)
    observation_date: date | None = None
    source: str | None = None


class PopulationResponse(PopulationBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime
    species: SpeciesResponse | None = None


class PopulationSummary(BaseModel):
    total_population: int
    number_of_species: int
    population_by_species: list[dict]
    recent_observations: list[PopulationResponse]
    population_trend_data: list[dict]
