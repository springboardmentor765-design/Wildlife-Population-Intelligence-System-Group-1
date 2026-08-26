from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime, timedelta
from database.database import get_db
from database.models import Detection

router = APIRouter()

def get_months():
    months = []
    now = datetime.now()
    for i in range(12):
        d = now + timedelta(days=30*i)
        months.append(d.strftime("%b %Y"))
    return months

@router.get("/trends")
def get_population_trends(db: Session = Depends(get_db)):
    months = []
    now = datetime.now()
    for i in range(5, -1, -1):
        d = now - timedelta(days=30*i)
        months.append(d.strftime("%b %Y"))
        
    # Get top 3 species
    top_species = db.query(
        Detection.species_name, 
        func.count(Detection.id).label('count')
    ).group_by(Detection.species_name).order_by(func.count(Detection.id).desc()).limit(3).all()
    
    datasets = []
    colors = ["#4CAF50", "#2196F3", "#FF9800"]
    
    for idx, (species, _) in enumerate(top_species):
        species_data = []
        for i in range(5, -1, -1):
            d = now - timedelta(days=30*i)
            # Find count for this month
            count = db.query(func.count(Detection.id)).filter(
                Detection.species_name == species,
                extract('month', Detection.timestamp) == d.month,
                extract('year', Detection.timestamp) == d.year
            ).scalar()
            species_data.append(count or 0)
            
        datasets.append({
            "label": species,
            "data": species_data,
            "borderColor": colors[idx % len(colors)]
        })
        
    return {
        "success": True,
        "labels": months,
        "datasets": datasets if datasets else [
            {"label": "No Data", "data": [0]*6, "borderColor": "#999999"}
        ]
    }

@router.get("/forecast")
def get_population_forecast(db: Session = Depends(get_db)):
    future_months = get_months()
    
    # Very simple linear forecast based on historical count (mock projection but using real base)
    top_species = db.query(
        Detection.species_name, 
        func.count(Detection.id).label('count')
    ).group_by(Detection.species_name).order_by(func.count(Detection.id).desc()).limit(2).all()
    
    datasets = []
    colors = ["#4CAF50", "#2196F3"]
    
    for idx, (species, count) in enumerate(top_species):
        base_val = count or 10
        datasets.append({
            "label": f"{species} (Forecast)",
            "data": [int(base_val + (i * 1.5)) for i in range(12)],
            "borderColor": colors[idx % len(colors)],
            "borderDash": [5, 5]
        })
        
    return {
        "success": True,
        "labels": future_months,
        "datasets": datasets if datasets else [
            {"label": "No Data (Forecast)", "data": [0]*12, "borderColor": "#999999", "borderDash": [5, 5]}
        ]
    }

@router.get("/anomalies")
def get_population_anomalies(db: Session = Depends(get_db)):
    
    # We will identify recent anomalies based on recent alerts or detections with Endangered status
    recent_anomalies = db.query(Detection).filter(
        Detection.endangered_status == "Endangered"
    ).order_by(Detection.timestamp.desc()).limit(2).all()
    
    anomalies = []
    for a in recent_anomalies:
        anomalies.append({
            "id": a.id,
            "species": a.species_name,
            "type": "Endangered Species Spotted",
            "severity": "High",
            "description": f"{a.species_name} spotted in area. Require immediate monitoring.",
            "date": a.timestamp.strftime("%Y-%m-%d"),
            "status": "Monitored"
        })
        
    if not anomalies:
         anomalies = [
            {
                "id": 1,
                "species": "None",
                "type": "System Normal",
                "severity": "Low",
                "description": "No recent anomalies detected.",
                "date": datetime.now().strftime("%Y-%m-%d"),
                "status": "Clear"
            }
        ]

    return {
        "success": True,
        "anomalies": anomalies
    }
