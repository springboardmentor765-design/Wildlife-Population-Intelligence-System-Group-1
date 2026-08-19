from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SurveyBase(BaseModel):
    survey_id: str
    location: str
    gps_coordinates: str
    habitat_type: str
    device: str
    protected_area: str

class SurveyCreate(SurveyBase):
    pass

class SurveyResponse(SurveyBase):
    id: int
    date: datetime

    class Config:
        from_attributes = True
