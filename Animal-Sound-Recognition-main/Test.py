import os
import torch
import torch.nn as nn
import torchaudio
import torchaudio.transforms as transforms
from torchvision import models
import pyaudio
import wave
import numpy as np
import noisereduce as nr
import time
from scipy.io.wavfile import write

# Check if GPU is available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")
num_classes = 13  # Manually set to match the trained model

# Load class names (same order as training)
data_path = r"D:\PythonProjects\Animal Sound Recognition\Dataset\Animals"
classes = sorted(os.listdir(data_path))  # Ensure class order consistency


# Define Model
class AnimalSoundClassifier(nn.Module):
    def __init__(self, num_classes):
        super(AnimalSoundClassifier, self).__init__()
        self.model = models.resnet18(weights=models.ResNet18_Weights.IMAGENET1K_V1)
        self.model.conv1 = nn.Conv2d(1, 64, kernel_size=(7, 7), stride=(2, 2), padding=(3, 3), bias=False)
        self.model.fc = nn.Linear(self.model.fc.in_features, num_classes)

    def forward(self, x):
        x = x.unsqueeze(1)  # Add channel dimension
        return self.model(x)

# Load trained model
model = AnimalSoundClassifier(num_classes).to(device)
model.load_state_dict(torch.load("best_model.pth", map_location=device))
model.eval()

# Define transformation
transform = transforms.MelSpectrogram(sample_rate=22050, n_mels=128, n_fft=2048, hop_length=512)

# Function to record audio
def record_audio(filename="realtime_audio.wav", record_seconds=5, sample_rate=22050, channels=1, chunk=1024):
    audio = pyaudio.PyAudio()
    stream = audio.open(format=pyaudio.paInt16, channels=channels,
                        rate=sample_rate, input=True,
                        frames_per_buffer=chunk)

    print("\n🎤 Recording audio for", record_seconds, "seconds...")
    frames = []
    for _ in range(0, int(sample_rate / chunk * record_seconds)):
        data = stream.read(chunk)
        frames.append(data)

    print("✅ Recording complete!")

    stream.stop_stream()
    stream.close()
    audio.terminate()

    # Save the recorded file
    wf = wave.open(filename, 'wb')
    wf.setnchannels(channels)
    wf.setsampwidth(audio.get_sample_size(pyaudio.paInt16))
    wf.setframerate(sample_rate)
    wf.writeframes(b''.join(frames))
    wf.close()

# Function to preprocess audio (Noise Reduction, Silence Trimming & Normalization)
def preprocess_audio(file_path):
    waveform, sample_rate = torchaudio.load(file_path)

    # Convert to mono
    if waveform.shape[0] > 1:
        waveform = torch.mean(waveform, dim=0, keepdim=True)

    # Convert to numpy for processing
    waveform_np = waveform.numpy().flatten()

    # Noise reduction
    reduced_noise = nr.reduce_noise(y=waveform_np, sr=sample_rate, stationary=True)

    # Normalize audio to a standard volume
    reduced_noise = reduced_noise / np.max(np.abs(reduced_noise))

    # Convert back to tensor
    waveform = torch.from_numpy(reduced_noise).unsqueeze(0)

    return waveform, sample_rate

# Function to predict live audio
def predict_live_audio():
    audio_file = "realtime_audio.wav"
    record_audio(audio_file)  # Record audio from mic

    waveform, sample_rate = preprocess_audio(audio_file)  # Apply preprocessing

    spectrogram = transform(waveform).squeeze(0)

    # Fix shape (pad/truncate)
    fixed_length = 128
    if spectrogram.shape[1] < fixed_length:
        spectrogram = torch.nn.functional.pad(spectrogram, (0, fixed_length - spectrogram.shape[1]))
    else:
        spectrogram = spectrogram[:, :fixed_length]

    spectrogram = spectrogram.unsqueeze(0).to(device)  # Add batch dim

    # Make multiple predictions and average them
    with torch.no_grad():
        outputs = [model(spectrogram) for _ in range(5)]
        output = torch.mean(torch.stack(outputs), dim=0)  # Average predictions
        probabilities = torch.nn.functional.softmax(output, dim=1)  # Get probabilities
        predicted_class = torch.argmax(probabilities).item()
        confidence = probabilities[0][predicted_class].item()  # Confidence score

    # Confidence-based filtering (Ignore low-confidence predictions)
    if confidence < 0.6:
        print("\n⚠ Low confidence in prediction, retrying...")
        return

    print(f"\n🔊 Predicted Animal: {classes[predicted_class]} (Confidence: {confidence:.2f})")

# Run the real-time prediction loop
while True:
    predict_live_audio()
    cont = input("\nPress Enter to record again, or type 'exit' to quit: ")
    if cont.lower() == "exit":
        break
