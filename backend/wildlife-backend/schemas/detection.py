from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DetectionBase(BaseModel):
    species_name: str
    confidence: float
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None
    source_type: Optional[str] = "Camera Trap Image"
    vegetation_cover: Optional[float] = None
    water_availability: Optional[float] = None
    temperature: Optional[float] = None
    forest_density: Optional[float] = None
    land_use_changes: Optional[str] = None
    bounding_box: Optional[str] = None
    behavior: Optional[str] = None
    endangered_status: Optional[str] = None

class DetectionCreate(DetectionBase):
    image_path: str

class DetectionResponse(DetectionBase):
    id: int
    image_path: str
    timestamp: datetime

    class Config:
        from_attributes = True
