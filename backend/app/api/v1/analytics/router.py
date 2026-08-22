from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.analytics import DashboardResponse
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["analytics"]); service = AnalyticsService()
@router.get("/dashboard", response_model=DashboardResponse)
def dashboard(db: Session = Depends(get_db), _: User = Depends(get_current_user)): return service.dashboard(db)
@router.get("/species")
def species(db: Session = Depends(get_db), _: User = Depends(get_current_user)): return service.species(db)
@router.get("/population")
def population(db: Session = Depends(get_db), _: User = Depends(get_current_user)): return service.population(db)
@router.get("/detections")
def detections(db: Session = Depends(get_db), _: User = Depends(get_current_user)): return service.detections(db)
