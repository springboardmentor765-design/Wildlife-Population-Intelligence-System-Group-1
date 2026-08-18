from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas
from app.deps import get_current_user

router = APIRouter(prefix="/surveys", tags=["Survey & Monitoring Service"])


@router.get("", response_model=List[schemas.SurveyOut])
def list_surveys(
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_current_user),
):
    q = db.query(models.Survey)
    if status:
        q = q.filter(models.Survey.status == status)
    return q.order_by(models.Survey.survey_date.desc()).all()


@router.post("", response_model=schemas.SurveyOut, status_code=201)
def create_survey(
    payload: schemas.SurveyCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    survey = models.Survey(**payload.model_dump(), created_by=current_user.user_id)
    db.add(survey)
    db.commit()
    db.refresh(survey)
    return survey


@router.patch("/{survey_id}", response_model=schemas.SurveyOut)
def update_survey(
    survey_id: int,
    payload: schemas.SurveyCreate,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_current_user),
):
    survey = db.query(models.Survey).filter(models.Survey.survey_id == survey_id).first()
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")
    for key, value in payload.model_dump().items():
        setattr(survey, key, value)
    db.commit()
    db.refresh(survey)
    return survey


@router.delete("/{survey_id}", status_code=204)
def delete_survey(
    survey_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    survey = db.query(models.Survey).filter(models.Survey.survey_id == survey_id).first()
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")
    if current_user.role != "administrator" and survey.created_by != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not allowed")
    db.delete(survey)
    db.commit()
