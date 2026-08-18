"""Discover trained weight files under backend/ml_models/."""
from __future__ import annotations

import json
from pathlib import Path

from app.config import AUDIO_MODEL_DIR, IMAGE_MODEL_DIR, settings

WEIGHT_EXTS = {".pt", ".pth", ".onnx", ".keras", ".h5", ".tflite", ".pkl", ".joblib", ".bin", ".weights"}

PREFERRED_IMAGE = (
    "best.pt",
    "last.pt",
    "wildlife_image.pt",
    "wildlife_yolo.pt",
    "yolov8.pt",
    "yolo.pt",
    "image_model.pt",
    "model.pt",
    "model.pth",
    "model.onnx",
    "model.keras",
    "model.h5",
    "best.onnx",
    "best.keras",
    "best.h5",
)

PREFERRED_AUDIO = (
    "best.pt",
    "last.pt",
    "wildlife_audio.pt",
    "wildlife_voice.pt",
    "voice_model.pt",
    "audio_model.pt",
    "yamnet.pt",
    "yamnet.tflite",
    "model.pt",
    "model.pth",
    "model.onnx",
    "model.keras",
    "model.h5",
    "best.onnx",
    "best.keras",
    "best.h5",
)


def _explicit_path(raw: str | None) -> Path | None:
    if not raw:
        return None
    path = Path(raw)
    if not path.is_absolute():
        path = Path(__file__).resolve().parent.parent.parent / raw
    return path if path.exists() and path.is_file() else None


def discover_weight(folder: Path, preferred: tuple[str, ...], explicit: str | None = None) -> Path | None:
    explicit_path = _explicit_path(explicit)
    if explicit_path:
        return explicit_path
    if not folder.exists():
        return None
    for name in preferred:
        candidate = folder / name
        if candidate.is_file():
            return candidate
    found = [
        p
        for p in folder.iterdir()
        if p.is_file() and p.suffix.lower() in WEIGHT_EXTS
    ]
    found.sort(key=lambda p: p.name.lower())
    return found[0] if found else None


def image_weight_path() -> Path | None:
    return discover_weight(IMAGE_MODEL_DIR, PREFERRED_IMAGE, settings.IMAGE_MODEL_PATH)


def audio_weight_path() -> Path | None:
    return discover_weight(AUDIO_MODEL_DIR, PREFERRED_AUDIO, settings.AUDIO_MODEL_PATH)


def load_label_map(folder: Path) -> dict[str, str]:
    """
    Accepts labels.json in any of these shapes:
      {"0": "Bengal Tiger", "1": "Asian Elephant"}
      {"names": {"0": "Bengal Tiger"}}
      {"tiger": "Bengal Tiger"}
    Also accepts labels.txt / class_names.txt (one class per line, index = line number).
    """
    mapping: dict[str, str] = {}
    json_path = folder / "labels.json"
    if json_path.exists():
        data = json.loads(json_path.read_text(encoding="utf-8"))
        if isinstance(data, dict) and "names" in data and isinstance(data["names"], dict):
            data = data["names"]
        if isinstance(data, dict):
            mapping = {str(k): str(v) for k, v in data.items()}
        elif isinstance(data, list):
            mapping = {str(i): str(v) for i, v in enumerate(data)}
    for txt_name in ("labels.txt", "class_names.txt", "classes.txt"):
        txt = folder / txt_name
        if txt.exists():
            for i, line in enumerate(txt.read_text(encoding="utf-8").splitlines()):
                name = line.strip()
                if name and not name.startswith("#"):
                    mapping.setdefault(str(i), name)
                    mapping.setdefault(name.lower(), name)
    return mapping


def resolve_label(raw: str, labels: dict[str, str]) -> str:
    if raw in labels:
        return labels[raw]
    lower = raw.lower()
    if lower in labels:
        return labels[lower]
    return raw
