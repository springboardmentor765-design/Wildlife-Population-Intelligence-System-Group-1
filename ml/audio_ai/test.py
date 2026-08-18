import os
import joblib
import librosa
import numpy as np
from tensorflow.keras.models import load_model

# =====================================================
# Load Model
# =====================================================

MODEL_PATH = "best_model.keras"   # or animal_sound_model.keras
LABEL_ENCODER_PATH = "label_encoder.pkl"
SCALER_PATH = "scaler.pkl"

model = load_model(MODEL_PATH)
label_encoder = joblib.load(LABEL_ENCODER_PATH)
scaler = joblib.load(SCALER_PATH)

# =====================================================
# Feature Extraction
# =====================================================

def extract_features(file_path):
    try:
        signal, sr = librosa.load(file_path, sr=22050)

        mfcc = librosa.feature.mfcc(
            y=signal,
            sr=sr,
            n_mfcc=40
        )

        feature = np.mean(mfcc.T, axis=0)

        return feature

    except Exception as e:
        print("Error:", e)
        return None


# =====================================================
# Prediction
# =====================================================

def predict(file_path):

    feature = extract_features(file_path)

    if feature is None:
        return

    feature = scaler.transform([feature])

    prediction = model.predict(feature, verbose=0)

    predicted_index = np.argmax(prediction)

    predicted_label = label_encoder.inverse_transform([predicted_index])[0]

    confidence = np.max(prediction) * 100

    print("\n==============================")
    print("Prediction :", predicted_label)
    print(f"Confidence : {confidence:.2f}%")
    print("==============================\n")


# =====================================================
# Main
# =====================================================

if __name__ == "__main__":

    audio_file = input("Enter WAV file path: ").strip()

    if not os.path.exists(audio_file):
        print("File not found!")
    else:
        predict(audio_file)







