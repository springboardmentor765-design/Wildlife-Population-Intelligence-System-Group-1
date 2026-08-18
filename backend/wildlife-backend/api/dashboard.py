from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database.database import get_db
from database.models import Detection, AudioPrediction
import math
from datetime import datetime, timedelta
from collections import defaultdict

router = APIRouter()

@router.get("/")
def get_dashboard_stats(db: Session = Depends(get_db)):
    # 1. Total Detections (Images + Audio)
    total_detections_img = db.query(Detection).count()
    total_detections_audio = db.query(AudioPrediction).count()
    total_detections = total_detections_img + total_detections_audio
    
    # 2. Species Counts
    counts_dict = defaultdict(int)
    for s in db.query(Detection.species_name, func.count(Detection.id)).group_by(Detection.species_name).all():
        counts_dict[s[0]] += s[1]
    for s in db.query(AudioPrediction.species_name, func.count(AudioPrediction.id)).group_by(AudioPrediction.species_name).all():
        counts_dict[s[0]] += s[1]
        
    species_counts = [{"species": k, "count": v} for k, v in counts_dict.items()]
    
    # 3. Recent Activity (Merge top 5 from both)
    recent_detections = db.query(Detection).order_by(Detection.timestamp.desc()).limit(5).all()
    recent_audio = db.query(AudioPrediction).order_by(AudioPrediction.created_at.desc()).limit(5).all()
    
    combined_recent = []
    for d in recent_detections:
        combined_recent.append({
            "id": f"det_{d.id}",
            "species_name": d.species_name,
            "confidence": d.confidence,
            "timestamp": d.timestamp,
            "image_path": d.image_path,
            "source_type": getattr(d, 'source_type', 'Camera Trap Image')
        })
    for a in recent_audio:
        combined_recent.append({
            "id": f"audio_{a.id}",
            "species_name": a.species_name,
            "confidence": a.confidence,
            "timestamp": a.created_at,
            "image_path": None,
            "source_type": getattr(a, 'source_type', 'Audio Recording')
        })
        
    combined_recent.sort(key=lambda x: x['timestamp'], reverse=True)
    recent_activity = combined_recent[:5]
    
    # 4. Calculate average environmental metrics (Only applies to Detections for now)
    env_metrics = db.query(
        func.avg(Detection.vegetation_cover).label('avg_veg'),
        func.avg(Detection.water_availability).label('avg_water'),
        func.avg(Detection.temperature).label('avg_temp'),
        func.avg(Detection.forest_density).label('avg_forest')
    ).first()
    
    # Get latest land use change
    latest_land_use = db.query(Detection.land_use_changes).filter(Detection.land_use_changes.isnot(None)).order_by(Detection.timestamp.desc()).first()
    
    # --- Intelligence & Scoring Engine (Phase 3) ---
    # 1. Species Diversity Score
    distinct_species_count = len(species_counts)
    species_diversity_score = min((distinct_species_count / 15.0) * 100, 100.0)
    
    # 2. Population Stability (Compare last 30 days to previous 30 days, including audio)
    now = datetime.utcnow()
    last_30_days = now - timedelta(days=30)
    prev_30_days = now - timedelta(days=60)
    
    current_count_img = db.query(Detection).filter(Detection.timestamp >= last_30_days).count()
    current_count_audio = db.query(AudioPrediction).filter(AudioPrediction.created_at >= last_30_days).count()
    current_count = current_count_img + current_count_audio
    
    previous_count_img = db.query(Detection).filter(Detection.timestamp >= prev_30_days, Detection.timestamp < last_30_days).count()
    previous_count_audio = db.query(AudioPrediction).filter(AudioPrediction.created_at >= prev_30_days, AudioPrediction.created_at < last_30_days).count()
    previous_count = previous_count_img + previous_count_audio
    
    if previous_count == 0:
        population_stability_score = 100.0 if current_count > 0 else 50.0
    else:
        ratio = current_count / previous_count
        diff = abs(1.0 - ratio)
        population_stability_score = max(100.0 - (diff * 50.0), 0.0)
    
    # 3. Habitat Quality Score
    veg = env_metrics.avg_veg if env_metrics and env_metrics.avg_veg else 0
    water = env_metrics.avg_water if env_metrics and env_metrics.avg_water else 0
    forest = env_metrics.avg_forest if env_metrics and env_metrics.avg_forest else 0
    habitat_quality_score = (veg + water + forest) / 3.0 if (veg + water + forest) > 0 else 0
    
    # 4. Endangered Species Status Score
    endangered_count_img = db.query(Detection).filter(Detection.endangered_status == "Endangered").count()
    endangered_count_audio = db.query(AudioPrediction).filter(AudioPrediction.endangered_status == "Endangered").count()
    endangered_count = endangered_count_img + endangered_count_audio
    
    endangered_ratio = endangered_count / total_detections if total_detections > 0 else 0
    endangered_score = max(100 - (endangered_ratio * 100 * 2), 0) # Double penalty
    
    # 5. Environmental Conditions Score
    env_conditions_score = 90.0 if latest_land_use and latest_land_use[0] in ["Stable", "Reforestation"] else 50.0
    
    # Weighted Ecosystem Health Score
    ecosystem_health_score = (
        (species_diversity_score * 0.30) +
        (population_stability_score * 0.25) +
        (habitat_quality_score * 0.20) +
        (endangered_score * 0.15) +
        (env_conditions_score * 0.10)
    )
    
    # Determine Status
    if ecosystem_health_score >= 85:
        conservation_status = "Excellent"
    elif ecosystem_health_score >= 70:
        conservation_status = "Healthy"
    elif ecosystem_health_score >= 50:
        conservation_status = "Moderate Concern"
    elif ecosystem_health_score >= 30:
        conservation_status = "Vulnerable"
    else:
        conservation_status = "Critical"
        
    # Generate Recommendations
    recommendations = []
    if endangered_ratio > 0.1:
        recommendations.append("High presence of endangered species detected. Deploy anti-poaching patrols.")
    if habitat_quality_score < 60:
        recommendations.append("Habitat degradation alert: Vegetation and forest density are dropping. Initiate restoration assessment.")
    if env_conditions_score < 60:
        recommendations.append("Deforestation detected. Escalate to Forest Department Officer.")
    if len(recommendations) == 0:
        recommendations.append("Ecosystem is stable. Maintain current monitoring schedules.")
    
    return {
        "total_detections": total_detections,
        "species_counts": species_counts,
        "recent_activity": recent_activity,
        "environmental_metrics": {
            "vegetation_cover": round(env_metrics.avg_veg, 1) if env_metrics and env_metrics.avg_veg else 0,
            "water_availability": round(env_metrics.avg_water, 1) if env_metrics and env_metrics.avg_water else 0,
            "temperature": round(env_metrics.avg_temp, 1) if env_metrics and env_metrics.avg_temp else 0,
            "forest_density": round(env_metrics.avg_forest, 1) if env_metrics and env_metrics.avg_forest else 0,
            "land_use_changes": latest_land_use[0] if latest_land_use else "Unknown"
        },
        "intelligence": {
            "species_diversity_score": round(species_diversity_score, 1),
            "population_stability_score": round(population_stability_score, 1),
            "habitat_quality_score": round(habitat_quality_score, 1),
            "endangered_score": round(endangered_score, 1),
            "env_conditions_score": round(env_conditions_score, 1),
            "ecosystem_health_score": round(ecosystem_health_score, 1),
            "conservation_status": conservation_status,
            "recommendations": recommendations
        }
    }