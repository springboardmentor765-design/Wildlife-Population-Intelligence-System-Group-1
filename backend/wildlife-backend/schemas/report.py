from pydantic import BaseModel
from datetime import datetime

class ReportBase(BaseModel):
    title: str
    content: str

class ReportCreate(ReportBase):
    user_id: int

class ReportResponse(ReportBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
