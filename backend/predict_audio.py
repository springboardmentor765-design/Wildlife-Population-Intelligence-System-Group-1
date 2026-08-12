import os
import torch
import librosa

from transformers import (
    AutoFeatureExtractor,
    AutoModelForAudioClassification
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "audio_model", "AnimalModel")

feature_extractor = AutoFeatureExtractor.from_pretrained(MODEL_PATH)
model = AutoModelForAudioClassification.from_pretrained(MODEL_PATH)

model.eval()


def create_waveform(audio, points=120):
    """
    Convert audio into a small amplitude envelope that
    can be rendered by the frontend waveform component.
    """

    if len(audio) == 0:
        return []

    # Absolute amplitude
    amplitude = abs(audio)

    # Split audio into equal sections
    chunks = len(amplitude) // points

    if chunks < 1:
        return [
            float(min(1.0, max(0.0, value)))
            for value in amplitude[:points]
        ]

    waveform = []

    for i in range(points):
        start = i * chunks

        if i == points - 1:
            chunk = amplitude[start:]
        else:
            chunk = amplitude[start:start + chunks]

        if len(chunk) == 0:
            value = 0
        else:
            value = float(chunk.mean())

        waveform.append(value)

    # Normalize to 0–1
    maximum = max(waveform) if waveform else 1

    if maximum > 0:
        waveform = [
            min(1.0, value / maximum)
            for value in waveform
        ]

    return waveform


def predict_audio(audio_path):

    # -------------------------------------------------
    # Load audio
    # -------------------------------------------------

    audio, sr = librosa.load(
        audio_path,
        sr=16000,
        mono=True
    )

    duration = float(len(audio) / sr)

    # -------------------------------------------------
    # Generate waveform
    # -------------------------------------------------

    waveform = create_waveform(audio)

    # -------------------------------------------------
    # Model prediction
    # -------------------------------------------------

    inputs = feature_extractor(
        audio,
        sampling_rate=16000,
        return_tensors="pt"
    )

    with torch.no_grad():
        outputs = model(**inputs)

    probabilities = torch.softmax(
        outputs.logits,
        dim=1
    )

    prediction = probabilities.argmax(
        dim=1
    ).item()

    confidence = float(
        probabilities[0][prediction]
    )

    animal = model.config.id2label[prediction]

    return {
        "animal": animal,
        "class_id": prediction,
        "confidence": round(confidence, 4),
        "duration": round(duration, 3),
        "sample_rate": sr,
        "waveform": waveform
    }