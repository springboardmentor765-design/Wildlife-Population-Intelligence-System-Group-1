from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class SpeciesBase(BaseModel):
    common_name: str = Field(min_length=2, max_length=160)
    scientific_name: str = Field(min_length=2, max_length=200)
    species_group: str = Field(min_length=2, max_length=80)
    iucn_status: str = Field(min_length=2, max_length=80)
    description: str | None = None
    habitat: str | None = None
    diet: str | None = None


class SpeciesCreate(SpeciesBase): pass
class SpeciesUpdate(BaseModel):
    common_name: str | None = None
    scientific_name: str | None = None
    species_group: str | None = None
    iucn_status: str | None = None
    description: str | None = None
    habitat: str | None = None
    diet: str | None = None


class SpeciesResponse(SpeciesBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime
    updated_at: datetime
