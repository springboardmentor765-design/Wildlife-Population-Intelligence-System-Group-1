from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class AlertBase(BaseModel):
    alert_type: str
    recipient: str
    message: str
    severity: Optional[str] = "Warning"

class AlertCreate(AlertBase):
    pass

class AlertResponse(AlertBase):
    id: int
    status: str
    timestamp: datetime

    class Config:
        from_attributes = True
