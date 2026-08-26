from pydantic import BaseModel


class DashboardResponse(BaseModel):
    total_species: int
    total_population: int
    images_processed: int
    audio_recordings: int
    average_confidence: float
    recent_detections: list[dict]
    population_activity: list[dict]
    ai_insight: str
