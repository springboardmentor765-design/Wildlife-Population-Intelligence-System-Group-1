from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas
from app.deps import get_current_user, require_roles
from app.services.intelligence import (
    dashboard_stats,
    biodiversity_metrics,
    habitat_suitability,
    conservation_actions,
    health_scores,
    admin_overview,
)
from app.ml.inference import status as ml_status

router = APIRouter(tags=["Intelligence Services"])


@router.get("/ml/status")
def get_ml_status(_: models.User = Depends(get_current_user)):
    return ml_status()


@router.get("/dashboard/stats")
def get_dashboard(db: Session = Depends(get_db), _: models.User = Depends(get_current_user)):
    return dashboard_stats(db)


@router.get("/admin/overview")
def get_admin_overview(
    db: Session = Depends(get_db),
    _: models.User = Depends(require_roles("administrator")),
):
    return admin_overview(db)


@router.get("/biodiversity")
def get_biodiversity(db: Session = Depends(get_db), _: models.User = Depends(get_current_user)):
    return biodiversity_metrics(db)


@router.get("/habitat")
def get_habitat(db: Session = Depends(get_db), _: models.User = Depends(get_current_user)):
    return habitat_suitability(db)


@router.get("/conservation")
def get_conservation(db: Session = Depends(get_db), _: models.User = Depends(get_current_user)):
    return conservation_actions(db)


@router.get("/health-score")
def get_health_score(db: Session = Depends(get_db), _: models.User = Depends(get_current_user)):
    return health_scores(db)


@router.get("/gis/sites")
def gis_sites(db: Session = Depends(get_db), _: models.User = Depends(get_current_user)):
    parks = habitat_suitability(db)
    surveys = db.query(models.Survey).all()
    return {
        "parks": parks,
        "surveys": [
            {
                "survey_id": s.survey_id,
                "title": s.title,
                "location": s.location,
                "lat": s.latitude,
                "lng": s.longitude,
                "status": s.status,
            }
            for s in surveys
            if s.latitude and s.longitude
        ],
    }


@router.get("/alerts", response_model=List[schemas.AlertOut])
def list_alerts(db: Session = Depends(get_db), current: models.User = Depends(get_current_user)):
    return (
        db.query(models.Alert)
        .filter((models.Alert.user_id == current.user_id) | (models.Alert.user_id.is_(None)))
        .order_by(models.Alert.created_at.desc())
        .limit(30)
        .all()
    )


@router.post("/alerts/{alert_id}/read", response_model=schemas.AlertOut)
def mark_alert_read(
    alert_id: int,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_current_user),
):
    alert = db.query(models.Alert).filter(models.Alert.alert_id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.is_read = True
    db.commit()
    db.refresh(alert)
    return alert


@router.get("/reports/summary")
def report_summary(db: Session = Depends(get_db), _: models.User = Depends(get_current_user)):
    stats = dashboard_stats(db)
    bio = biodiversity_metrics(db)
    health = health_scores(db)
    return {
        "title": "Wildlife Population Intelligence — Conservation Report",
        "stats": stats,
        "biodiversity": bio,
        "health": health,
        "conservation": conservation_actions(db),
        "habitat": habitat_suitability(db),
    }
