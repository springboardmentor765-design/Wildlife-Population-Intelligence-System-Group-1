# Animal Sound Recognition

An **Animal Sound Recognition / Audio Classification** project that identifies animal sounds from recorded audio.

This repository includes:
- **Real-time audio recording + prediction** using a trained model
- **Training pipeline** for animal sound classification from a labeled dataset

## Project Overview

This project classifies animal sounds (e.g., dog, cat, cow, etc.) using machine learning / deep learning models.

### Included Pipelines
1. **PyTorch Real-Time Prediction Pipeline**
   - Records audio from microphone
   - Applies preprocessing (noise reduction + normalization)
   - Converts audio to **Mel Spectrogram**
   - Uses a trained **ResNet18-based classifier** to predict animal class

2. **TensorFlow/Keras Training Pipeline**
   - Loads `.wav` files from dataset folders
   - Extracts **MFCC features**
   - Trains a dense neural network classifier
   - Saves trained model and label encoder

> ⚠️ Note: The current training and inference scripts use different feature/model frameworks (**TensorFlow MFCC model** vs **PyTorch MelSpectrogram ResNet model**). They are not directly interchangeable unless trained/exported consistently.

## Features

- Animal sound classification from audio
- Microphone recording for real-time prediction
- Audio preprocessing (noise reduction, normalization)
- Mel Spectrogram feature generation
- MFCC-based model training
- Label encoding and model saving
- Confidence-based filtering for predictions

## Tech Stack

- Python
- PyTorch / Torchvision / Torchaudio
- TensorFlow / Keras
- Librosa
- NumPy
- Scikit-learn
- PyAudio
- Noisereduce
- SciPy

## Project Structure (Suggested)

```text
Animal Sound Recognition/
├── realtime_predict.py
├── train_model.py
├── best_model.pth
├── animal_sound_recognition_model.h5
├── label_encoder.pkl
├── requirements.txt
├── README.md
└── Dataset/
    └── Animals/
