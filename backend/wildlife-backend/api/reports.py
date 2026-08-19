from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database.database import get_db
from database.models import Report, Detection
from schemas.report import ReportCreate, ReportResponse
import pandas as pd
from fastapi.responses import StreamingResponse
import io

router = APIRouter()

@router.get("/", response_model=List[ReportResponse])
def get_reports(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    reports = db.query(Report).offset(skip).limit(limit).all()
    return reports

@router.post("/", response_model=ReportResponse)
def create_report(report: ReportCreate, db: Session = Depends(get_db)):
    db_report = Report(**report.dict())
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

@router.get("/export/excel")
def export_reports_excel(db: Session = Depends(get_db)):
    detections = db.query(Detection).all()
    
    data = []
    for d in detections:
        data.append({
            "ID": d.id,
            "Species Name": d.species_name,
            "Confidence": d.confidence,
            "Timestamp": d.timestamp,
            "Source Type": d.source_type,
            "Location Lat": d.location_lat,
            "Location Lng": d.location_lng,
            "Vegetation Cover": d.vegetation_cover,
            "Water Availability": d.water_availability,
            "Temperature": d.temperature,
            "Forest Density": d.forest_density,
            "Land Use Changes": d.land_use_changes,
            "Behavior": d.behavior,
            "Endangered Status": d.endangered_status
        })
        
    df = pd.DataFrame(data)
    
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name='Detections')
        
    output.seek(0)
    
    headers = {
        'Content-Disposition': 'attachment; filename="wildlife_report.xlsx"'
    }
    
    return StreamingResponse(output, headers=headers, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")