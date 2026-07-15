import os
import torch
from ultralytics import YOLO

# =====================================================
# Configuration
# =====================================================

MODEL_PATH = "runs/detect/runs/wildlife_detection/weights/best.pt"
DATA_PATH = "data/raw/data.yaml"

IMAGE_SIZE = 640
CONFIDENCE = 0.25

PROJECT = "runs"
NAME = "evaluation"

# =====================================================
# Check GPU
# =====================================================

print("=" * 60)
print("Wildlife Population Intelligence System")
print("Model Evaluation")
print("=" * 60)

if torch.cuda.is_available():
    DEVICE = 0
    print(f"Device : {torch.cuda.get_device_name(0)}")
else:
    DEVICE = "cpu"
    print("Device : CPU")

print("=" * 60)

# =====================================================
# Check Model
# =====================================================

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        f"Model not found:\n{MODEL_PATH}"
    )

# =====================================================
# Load Model
# =====================================================

print("\nLoading Model...")

model = YOLO(MODEL_PATH)

# =====================================================
# Evaluate Model
# =====================================================

print("\nEvaluating...\n")

metrics = model.val(

    data=DATA_PATH,

    imgsz=IMAGE_SIZE,

    batch=16,

    device=DEVICE,

    conf=CONFIDENCE,

    split="test",

    project=PROJECT,

    name=NAME,

    save_json=True,

    plots=True,

    verbose=True

)

print("\nEvaluation Completed!")

# =====================================================
# Print Results
# =====================================================

print("\n========== METRICS ==========")

print(f"mAP50      : {metrics.box.map50:.4f}")
print(f"mAP50-95   : {metrics.box.map:.4f}")
print(f"Precision  : {metrics.box.mp:.4f}")
print(f"Recall     : {metrics.box.mr:.4f}")

print("=============================\n")

# =====================================================
# Predict Test Images
# =====================================================

TEST_IMAGES = "data/test/images"

if os.path.exists(TEST_IMAGES):

    print("Generating Predictions...")

    model.predict(

        source=TEST_IMAGES,

        imgsz=IMAGE_SIZE,

        conf=CONFIDENCE,

        save=True,

        save_txt=True,

        project=PROJECT,

        name="test_predictions"

    )

print("\nPrediction Images Saved!")

print("\nEvaluation Finished Successfully!")