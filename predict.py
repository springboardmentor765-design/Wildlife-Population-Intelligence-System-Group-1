import os
import torch
from ultralytics import YOLO

# ======================================================
# Configuration
# ======================================================

MODEL_PATH = "runs/detect/runs/wildlife_detection/weights/best.pt"

# Image / Folder / Video / Webcam
SOURCE = "data/raw/test/images"

IMAGE_SIZE = 640
CONFIDENCE = 0.25

PROJECT = "runs"
NAME = "predictions"

# ======================================================
# GPU Check
# ======================================================

print("=" * 60)
print("Wildlife Population Intelligence System")
print("YOLO11 Prediction")
print("=" * 60)

if torch.cuda.is_available():
    DEVICE = 0
    print("GPU :", torch.cuda.get_device_name(0))
else:
    DEVICE = "cpu"
    print("Running on CPU")

print("=" * 60)

# ======================================================
# Check Model
# ======================================================

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model not found:\n{MODEL_PATH}")

# ======================================================
# Load Model
# ======================================================

model = YOLO(MODEL_PATH)

print("\nRunning Prediction...\n")

# ======================================================
# Prediction
# ======================================================

results = model.predict(
    source=SOURCE,
    imgsz=IMAGE_SIZE,
    conf=CONFIDENCE,
    device=DEVICE,
    save=True,
    save_txt=True,
    save_conf=True,
    project=PROJECT,
    name=NAME,
    exist_ok=True,
    verbose=True
)

# ======================================================
# Display Results
# ======================================================

print("\nPrediction Summary")
print("=" * 60)

for i, result in enumerate(results):

    print(f"\nImage {i+1}")

    boxes = result.boxes

    if boxes is None or len(boxes) == 0:
        print("No objects detected.")
        continue

    print(f"Objects Detected : {len(boxes)}")

    for box in boxes:

        cls = int(box.cls)

        conf = float(box.conf)

        label = model.names[cls]

        print(f"{label:20} Confidence : {conf:.2f}")

print("\nPrediction Completed Successfully!")