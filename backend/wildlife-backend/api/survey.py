from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database.database import get_db
from database import models
from schemas import survey as survey_schema
from utils.dependencies import get_current_user, require_role

router = APIRouter()

@router.post("/", response_model=survey_schema.SurveyResponse)
def create_survey(
    survey: survey_schema.SurveyCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role(["Wildlife Researcher", "Conservation Officer"]))
):
    db_survey = db.query(models.Survey).filter(models.Survey.survey_id == survey.survey_id).first()
    if db_survey:
        raise HTTPException(status_code=400, detail="Survey ID already exists")

    new_survey = models.Survey(
        survey_id=survey.survey_id,
        location=survey.location,
        gps_coordinates=survey.gps_coordinates,
        habitat_type=survey.habitat_type,
        device=survey.device,
        protected_area=survey.protected_area
    )
    db.add(new_survey)
    db.commit()
    db.refresh(new_survey)
    return new_survey

@router.get("/", response_model=list[survey_schema.SurveyResponse])
def get_surveys(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    surveys = db.query(models.Survey).offset(skip).limit(limit).all()
    return surveys
