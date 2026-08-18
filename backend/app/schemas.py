from datetime import date, datetime
from typing import Optional, List

from pydantic import BaseModel, EmailStr, ConfigDict, Field, computed_field


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(min_length=6)
    role: str = "researcher"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class GoogleLoginRequest(BaseModel):
    credential: str
    role: str = "researcher"


class UserUpdate(BaseModel):
    role: Optional[str] = None
    name: Optional[str] = None


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: int
    name: str
    email: EmailStr
    role: str
    avatar_path: Optional[str] = None
    auth_provider: Optional[str] = "local"
    created_at: datetime

    @computed_field
    @property
    def avatar_url(self) -> Optional[str]:
        if not self.avatar_path:
            return None
        rel = self.avatar_path.replace("\\", "/")
        if rel.startswith("uploads/"):
            rel = rel[len("uploads/") :]
        return f"/static/{rel}"


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class SpeciesCreate(BaseModel):
    common_name: str
    scientific_name: str
    species_group: Optional[str] = None
    iucn_status: Optional[str] = None


class SpeciesOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    species_id: int
    common_name: str
    scientific_name: str
    species_group: Optional[str] = None
    iucn_status: Optional[str] = None


class ImageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    image_id: int
    user_id: int
    image_path: str
    uploaded_at: datetime
    species_id: Optional[int] = None
    animal_count: Optional[int] = None
    confidence: Optional[float] = None
    species: Optional[SpeciesOut] = None


class ImageAnalysisResult(BaseModel):
    image_id: int
    species_id: Optional[int] = None
    species_common_name: str
    scientific_name: Optional[str] = None
    species_group: Optional[str] = None
    iucn_status: Optional[str] = None
    animal_count: int
    confidence: float
    detections: List[dict] = []
    population_record_id: Optional[int] = None
    image_path: Optional[str] = None
    model: Optional[str] = None
    backend: Optional[str] = None


class AudioOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    audio_id: int
    user_id: int
    audio_path: str
    uploaded_at: datetime
    species_id: Optional[int] = None
    confidence: Optional[float] = None
    duration: Optional[float] = None
    species: Optional[SpeciesOut] = None


class AudioAnalysisResult(BaseModel):
    audio_id: int
    species_id: int
    species_common_name: str
    scientific_name: str
    confidence: float
    duration: float
    spectrogram_peaks: List[float] = []
    population_record_id: Optional[int] = None
    audio_path: Optional[str] = None
    model: Optional[str] = None
    backend: Optional[str] = None
    top_predictions: List[dict] = []


class PopulationCreate(BaseModel):
    species_id: int
    image_id: Optional[int] = None
    audio_id: Optional[int] = None
    population_count: int
    observation_date: date


class PopulationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    population_id: int
    species_id: int
    image_id: Optional[int] = None
    audio_id: Optional[int] = None
    population_count: int
    observation_date: date
    species: Optional[SpeciesOut] = None


class SurveyCreate(BaseModel):
    title: str
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    survey_date: date
    status: str = "Pending"
    notes: Optional[str] = None
    species_count: int = 0


class SurveyOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    survey_id: int
    title: str
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    survey_date: date
    status: str
    notes: Optional[str] = None
    species_count: int
    created_by: Optional[int] = None
    created_at: datetime


class AlertOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    alert_id: int
    title: str
    message: str
    severity: str
    is_read: bool
    created_at: datetime
