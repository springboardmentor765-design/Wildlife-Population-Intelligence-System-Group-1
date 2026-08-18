"""
AI / ML inference layer.

Trained weights live in backend/ml_models/image and backend/ml_models/audio.
This module is the stable contract used by the Image and Audio analysis services.
"""
from app.ml.bioacoustic import estimate_audio_duration, model_status as audio_model_status
from app.ml.bioacoustic import predict_from_audio
from app.ml.species_map import match_species_by_filename as match_species_by_name
from app.ml.vision import model_status as image_model_status
from app.ml.vision import predict_from_image


def status() -> dict:
    return {
        "image": image_model_status(),
        "audio": audio_model_status(),
    }


__all__ = [
    "predict_from_image",
    "predict_from_audio",
    "estimate_audio_duration",
    "match_species_by_name",
    "status",
]
