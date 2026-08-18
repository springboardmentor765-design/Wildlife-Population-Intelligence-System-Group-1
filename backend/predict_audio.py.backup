import torch
import librosa

from transformers import (
    AutoFeatureExtractor,
    AutoModelForAudioClassification
)

# Load model only once
MODEL_PATH = "backend/audio_model/AnimalModel"

feature_extractor = AutoFeatureExtractor.from_pretrained(MODEL_PATH)

model = AutoModelForAudioClassification.from_pretrained(MODEL_PATH)

model.eval()


def predict_audio(audio_path):

    audio, sr = librosa.load(audio_path, sr=16000)

    inputs = feature_extractor(
        audio,
        sampling_rate=16000,
        return_tensors="pt"
    )

    with torch.no_grad():
        outputs = model(**inputs)

    probabilities = torch.softmax(outputs.logits, dim=1)

    prediction = probabilities.argmax(dim=1).item()

    confidence = float(probabilities[0][prediction])

    return {
        "animal": model.config.id2label[prediction],
        "confidence": round(confidence, 4)
    }