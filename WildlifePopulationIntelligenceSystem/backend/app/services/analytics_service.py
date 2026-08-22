from sqlalchemy import func, select
from sqlalchemy.orm import Session
from app.models.audio import Audio
from app.models.image import Image
from app.models.image_detection import ImageDetection
from app.models.population import Population
from app.models.species import Species

class AnalyticsService:
    def dashboard(self, db: Session) -> dict:
        images = db.scalar(select(func.count()).select_from(Image).where(Image.status == "Verified")) or 0
        audio = db.scalar(select(func.count()).select_from(Audio).where(Audio.status == "Verified")) or 0
        population = db.scalar(select(func.coalesce(func.sum(Population.population_count), 0))) or 0
        avg_image = db.scalar(select(func.avg(ImageDetection.confidence)))
        avg_audio = db.scalar(select(func.avg(Audio.confidence)).where(Audio.confidence.is_not(None)))
        averages = [float(v) for v in (avg_image, avg_audio) if v is not None]
        recent = []
        for item in db.scalars(select(Image).order_by(Image.created_at.desc()).limit(5)):
            detections = list(db.scalars(select(ImageDetection).where(ImageDetection.image_id == item.id).order_by(ImageDetection.confidence.desc())))
            names = {}
            for detection in detections:
                species = db.get(Species, detection.species_id)
                label = species.common_name if species else "Unidentified"
                names[label] = names.get(label, 0) + 1
            summary = ", ".join(f"{name} ({count})" for name, count in names.items()) or (db.get(Species, item.species_id).common_name if item.species_id else "Unidentified")
            recent.append({"id": item.id, "type": "image", "species": summary, "confidence": item.confidence, "location": item.location, "count": item.animal_count or 0, "created_at": item.created_at})
        for item in db.scalars(select(Audio).order_by(Audio.created_at.desc()).limit(5)):
            species = db.get(Species, item.species_id) if item.species_id else None
            recent.append({"id": item.id, "type": "audio", "species": species.common_name if species else "Unidentified", "confidence": item.confidence, "location": item.location, "count": 1, "created_at": item.created_at})
        recent.sort(key=lambda row: row["created_at"], reverse=True)
        activity = db.execute(select(func.date_trunc("month", Population.observation_date).label("month"), func.sum(Population.population_count)).group_by("month").order_by("month")).all()
        top = db.execute(select(Species.common_name, func.sum(Population.population_count)).join(Population).group_by(Species.id, Species.common_name).order_by(func.sum(Population.population_count).desc()).limit(1)).first()
        insight = f"Rule-based insight: {top[0]} has the highest recorded population ({top[1]} observations)." if top else "Rule-based insight: add observations to generate a population summary."
        return {"total_species": db.scalar(select(func.count()).select_from(Species)) or 0, "total_population": population, "images_processed": images, "audio_recordings": audio, "average_confidence": round(sum(averages) / len(averages), 2) if averages else 0, "recent_detections": recent[:8], "population_activity": [{"month": str(row[0].date()), "population": row[1]} for row in activity], "ai_insight": insight}
    def species(self, db: Session) -> dict:
        image_count = select(func.count(ImageDetection.id)).where(ImageDetection.species_id == Species.id).scalar_subquery()
        audio_count = select(func.count(Audio.id)).where(Audio.species_id == Species.id).scalar_subquery()
        rows = db.execute(select(Species.common_name, image_count, audio_count)).all()
        return {"species_distribution": [{"species": r[0], "image_detections": r[1], "audio_detections": r[2]} for r in rows]}
    def population(self, db: Session) -> dict: return {"population_trends": self.dashboard(db)["population_activity"]}
    def detections(self, db: Session) -> dict:
        return {"image_detections": db.scalar(select(func.count()).select_from(ImageDetection)) or 0, "audio_detections": db.scalar(select(func.count()).select_from(Audio)) or 0, "top_detected_species": self.species(db)["species_distribution"]}
