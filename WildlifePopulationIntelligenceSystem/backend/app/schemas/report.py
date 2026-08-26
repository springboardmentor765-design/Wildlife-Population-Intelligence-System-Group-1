from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class ReportCreate(BaseModel):
    name: str = Field(min_length=2, max_length=255)
    report_type: str = "population"


class ReportResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    report_type: str
    created_by: int
    status: str
    file_path: str | None = None
    created_at: datetime
    generated_at: datetime | None
