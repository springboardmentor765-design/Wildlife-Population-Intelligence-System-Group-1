"""Wildlife Image Analysis Service — YOLOv8 / Keras / ONNX / demo fallback."""
from __future__ import annotations

import hashlib
import random
from pathlib import Path
from typing import Sequence

from app import models
from app.config import IMAGE_MODEL_DIR
from app.ml.loader import image_weight_path, load_label_map, resolve_label
from app.ml.species_map import match_species, match_species_by_filename

_loaded = False
_backend: str | None = None
_model = None
_weight: Path | None = None
_labels: dict[str, str] = {}
_error: str | None = None


def _rng_from(seed_text: str) -> random.Random:
    digest = hashlib.sha256(seed_text.encode("utf-8")).hexdigest()
    return random.Random(int(digest[:16], 16))


def model_status() -> dict:
    _ensure_loaded()
    return {
        "loaded": _backend not in (None, "demo"),
        "backend": _backend or "demo",
        "weight": str(_weight) if _weight else None,
        "error": _error,
        "place_file_in": str(IMAGE_MODEL_DIR),
    }


def _ensure_loaded() -> None:
    global _loaded, _backend, _model, _weight, _labels, _error
    if _loaded and _backend == "yolo" and _model is not None:
        return
    _labels = load_label_map(IMAGE_MODEL_DIR)
    _weight = image_weight_path()
    if not _weight:
        _backend = "demo"
        _loaded = True
        _error = f"No image weight file in {IMAGE_MODEL_DIR}"
        return

    suffix = _weight.suffix.lower()
    try:
        if suffix in {".pt", ".pth"}:
            from ultralytics import YOLO

            _model = YOLO(str(_weight))
            _backend = "yolo"
            _error = None
            _loaded = True
            return
        if suffix in {".keras", ".h5"}:
            import tensorflow as tf

            _model = tf.keras.models.load_model(str(_weight))
            _backend = "keras"
            _error = None
            _loaded = True
            return
        if suffix == ".onnx":
            import onnxruntime as ort

            _model = ort.InferenceSession(str(_weight))
            _backend = "onnx"
            _error = None
            _loaded = True
            return
        _error = f"Unsupported image weight type: {suffix}"
    except Exception as exc:
        _error = str(exc)
        _model = None
        _backend = "demo"
    _loaded = True


def _demo(filename: str, file_size: int, species_pool: Sequence[models.Species]) -> dict:
    rng = _rng_from(f"{filename}:{file_size}:vision")
    matched = match_species_by_filename(filename, species_pool)
    species = matched or rng.choice(list(species_pool))
    animal_count = 1 if matched else rng.randint(1, 6)
    confidence = round(rng.uniform(0.86, 0.98) if matched else rng.uniform(0.72, 0.93), 3)
    detections = []
    for i in range(animal_count):
        detections.append(
            {
                "id": i + 1,
                "label": species.common_name,
                "confidence": round(max(0.55, confidence - rng.uniform(0, 0.12)), 3),
                "box": {
                    "x": round(rng.uniform(0.05, 0.55), 3),
                    "y": round(rng.uniform(0.05, 0.55), 3),
                    "w": round(rng.uniform(0.18, 0.38), 3),
                    "h": round(rng.uniform(0.18, 0.42), 3),
                },
            }
        )
    return {
        "species": species,
        "animal_count": animal_count,
        "confidence": confidence,
        "detections": detections,
        "model": "demo-fallback",
        "backend": "demo",
    }


def _pack(species: models.Species, animal_count: int, confidence: float, detections: list, model_name: str) -> dict:
    return {
        "species": species,
        "animal_count": animal_count,
        "confidence": round(float(confidence), 3),
        "detections": detections,
        "model": model_name,
        "backend": _backend or "demo",
    }


def _predict_yolo(image_path: Path, species_pool: Sequence[models.Species]) -> dict:
    """Class names come from the YOLO weights, not a labels.json file."""
    results = _model.predict(str(image_path), verbose=False, conf=0.15, imgsz=640)
    if not results:
        return {
            "species": None,
            "detected_label": None,
            "animal_count": 0,
            "confidence": 0.0,
            "detections": [],
            "model": f"YOLOv8:{_weight.name}",
            "backend": "yolo",
        }
    result = results[0]
    names = getattr(result, "names", None) or getattr(_model, "names", {}) or {}
    detections = []
    best_conf = -1.0
    best_label = ""
    boxes = getattr(result, "boxes", None)
    if boxes is not None:
        for i, box in enumerate(boxes):
            cls_id = int(box.cls[0])
            conf = float(box.conf[0])
            label = str(names.get(cls_id, cls_id) if isinstance(names, dict) else cls_id)
            xywhn = box.xywhn[0].tolist()
            cx, cy, w, h = [float(v) for v in xywhn]
            detections.append(
                {
                    "id": i + 1,
                    "label": label,
                    "confidence": round(conf, 3),
                    "box": {
                        "x": round(max(0.0, cx - w / 2), 3),
                        "y": round(max(0.0, cy - h / 2), 3),
                        "w": round(w, 3),
                        "h": round(h, 3),
                    },
                }
            )
            if conf > best_conf:
                best_conf = conf
                best_label = label

    species = match_species(best_label, species_pool) if best_label else None
    return {
        "species": species,
        "detected_label": best_label or None,
        "animal_count": len(detections),
        "confidence": round(float(max(best_conf, 0.0)), 3) if detections else 0.0,
        "detections": detections,
        "model": f"YOLOv8:{_weight.name}",
        "backend": "yolo",
    }


def _predict_keras(image_path: Path, species_pool: Sequence[models.Species]) -> dict | None:
    import numpy as np
    from PIL import Image

    image = Image.open(image_path).convert("RGB")
    shape = getattr(_model, "input_shape", None)
    size = 224
    if shape and len(shape) >= 3 and shape[1] and shape[2]:
        size = int(shape[1])
    arr = np.asarray(image.resize((size, size)), dtype="float32") / 255.0
    arr = np.expand_dims(arr, 0)
    preds = _model.predict(arr, verbose=0)
    vector = preds[0] if hasattr(preds, "__getitem__") else preds
    idx = int(np.argmax(vector))
    conf = float(vector[idx])
    label = resolve_label(str(idx), _labels)
    species = match_species(label, species_pool)
    detections = [
        {
            "id": 1,
            "label": label,
            "confidence": round(conf, 3),
            "box": {"x": 0.15, "y": 0.15, "w": 0.7, "h": 0.7},
        }
    ]
    return _pack(species, 1, conf, detections, f"Keras:{_weight.name}")


def predict_from_image(
    filename: str,
    file_size: int,
    species_pool: Sequence[models.Species],
    image_path: Path | None = None,
) -> dict:
    _ensure_loaded()
    if not species_pool:
        raise ValueError("Species catalog is empty")

    if _backend == "yolo":
        if not image_path or not image_path.exists():
            raise RuntimeError(f"Image file missing on disk: {image_path}")
        return _predict_yolo(image_path, species_pool)

    if _backend == "keras" and image_path and image_path.exists():
        result = _predict_keras(image_path, species_pool)
        if result:
            return result

    if _weight is not None:
        raise RuntimeError(_error or "Image model is present but failed to load. Restart the API.")

    return _demo(filename, file_size, species_pool)
