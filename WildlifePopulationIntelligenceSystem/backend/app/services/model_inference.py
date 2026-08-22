"""Adapters for the supplied YOLO image and Keras audio models."""
from __future__ import annotations

import pickle
import logging
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

MODEL_DIR = Path(__file__).resolve().parents[2] / "models"
logger = logging.getLogger(__name__)

# The audio classifier was trained with scientific/taxonomic labels. Keep the
# model output intact, but expose the familiar common name in the product.
COMMON_NAME_BY_LABEL = {
    "equus caballus": "Horse", "equus asinus": "Donkey", "felis catus": "Cat",
    "canis lupus": "Wolf", "panthera leo": "Lion", "elephas maximus": "Elephant",
    "bos taurus": "Cattle", "ovis aries": "Sheep", "gallus gallus domesticus": "Chicken",
    "ursidae": "Bear", "anura": "Frog", "cercopithecidae": "Monkey",
    "cardinalis cardinalis": "Northern Cardinal", "carduelis carduelis": "Goldfinch",
    "passer domesticus": "House Sparrow", "corvus ossifragus": "Fish Crow",
    "larus californicus": "California Gull", "selasphorus rufus": "Rufous Hummingbird",
}

def common_name_for_label(label: str | None) -> str | None:
    if not label:
        return None
    cleaned = " ".join(label.replace("_", " ").split())
    return COMMON_NAME_BY_LABEL.get(cleaned.casefold(), cleaned.title())


class ModelUnavailableError(RuntimeError):
    """Raised when the trained artefacts required for an inference are absent."""

@dataclass(frozen=True)
class ImageBoxPrediction:
    species_name: str
    class_id: int
    confidence: float
    bbox: list[float]


def model_file(name: str) -> Path | None:
    candidate = MODEL_DIR / name
    return candidate if candidate.is_file() else None


@lru_cache
def image_model():
    path = model_file("best.pt")
    if path is None: return None
    from ultralytics import YOLO
    return YOLO(path)


@lru_cache
def audio_assets():
    model_path, encoder_path = model_file("audio_model_v2_77.keras"), model_file("label_encoder_v2.pkl")
    if model_path is None or encoder_path is None: return None, None
    import tensorflow as tf
    with encoder_path.open("rb") as source: encoder = pickle.load(source)
    return tf.keras.models.load_model(model_path), encoder


def predict_image(path: str, annotated_path: str | None = None) -> list[ImageBoxPrediction]:
    model = image_model()
    if model is None:
        raise ModelUnavailableError("Image model file best.pt was not found. Add it to backend/models/ and restart the API.")
    results = model(path, verbose=False)
    if annotated_path:
        from PIL import Image
        plotted = results[0].plot()
        Image.fromarray(plotted[..., ::-1]).save(annotated_path)
    boxes = results[0].boxes
    if boxes is None or len(boxes) == 0:
        logger.info("YOLO RAW DETECTIONS: []")
        logger.info("TOTAL RAW DETECTIONS: 0")
        return []
    predictions = []
    for box in boxes:
        class_id = int(box.cls.item())
        predictions.append(ImageBoxPrediction(
            species_name=str(model.names[class_id]), class_id=class_id,
            confidence=float(box.conf.item()), bbox=[float(v) for v in box.xyxy[0].tolist()],
        ))
    logger.info("YOLO RAW DETECTIONS: %s", [f"{p.species_name} | confidence={p.confidence:.4f} | bbox={p.bbox}" for p in predictions])
    logger.info("TOTAL RAW DETECTIONS: %d", len(predictions))
    return predictions


def predict_audio(path: str) -> tuple[str | None, float | None]:
    model, encoder = audio_assets()
    if model is None or encoder is None:
        raise ModelUnavailableError("Audio files audio_model_v2_77.keras and label_encoder_v2.pkl were not found. Add them to backend/models/ and restart the API.")
    import librosa
    import librosa.display
    import matplotlib
    import numpy as np
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from PIL import Image
    audio, sample_rate = librosa.load(path, sr=22050)
    mel = librosa.feature.melspectrogram(y=audio, sr=sample_rate)
    mel_db = librosa.power_to_db(mel, ref=np.max)
    figure, axis = plt.subplots(figsize=(2.24, 2.24), dpi=100)
    axis.axis("off")
    librosa.display.specshow(mel_db, sr=sample_rate, ax=axis)
    figure.tight_layout(pad=0)
    from io import BytesIO
    buffer = BytesIO()
    figure.savefig(buffer, format="png", bbox_inches="tight", pad_inches=0)
    plt.close(figure)
    buffer.seek(0)
    spectrogram = Image.open(buffer).convert("RGB").resize((224, 224))
    prediction = model.predict(np.expand_dims(np.asarray(spectrogram) / 255.0, axis=0), verbose=0)[0]
    index = int(np.argmax(prediction))
    raw_label = str(encoder.inverse_transform([index])[0])
    return common_name_for_label(raw_label), float(prediction[index])
