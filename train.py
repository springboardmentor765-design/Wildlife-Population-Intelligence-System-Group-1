import os
import torch
from ultralytics import YOLO

# =====================================================
# Configuration
# =====================================================

MODEL = "yolo11n.pt"          # Options: yolo11n.pt, yolo11s.pt, yolo11m.pt
DATA = "data/raw/data.yaml"

EPOCHS = 1
IMG_SIZE = 640
PROJECT = "runs"
NAME = "wildlife_detection"

# =====================================================
# GPU Information
# =====================================================

print("=" * 60)
print("Wildlife Population Intelligence System")
print("=" * 60)

if torch.cuda.is_available():
    DEVICE = 0
    print(f"GPU       : {torch.cuda.get_device_name(0)}")
    print(f"CUDA      : {torch.version.cuda}")
    print(f"PyTorch   : {torch.__version__}")
else:
    DEVICE = "cpu"
    print("GPU       : CPU")

print("=" * 60)

# =====================================================
# Load YOLO Model
# =====================================================

print("Loading YOLO model...")
model = YOLO(MODEL)

# =====================================================
# Train Model
# =====================================================

print("\nStarting Training...\n")

results = model.train(

    data=DATA,

    epochs=EPOCHS,

    imgsz=IMG_SIZE,

    batch=-1,

    device=DEVICE,

    workers=8,

    optimizer="AdamW",

    lr0=0.001,

    weight_decay=0.0005,

    cos_lr=True,

    warmup_epochs=5,

    patience=30,

    pretrained=True,

    amp=True,

    cache=True,

    project=PROJECT,

    name=NAME,

    exist_ok=True,

    save=True,

    val=True,

    verbose=True,

    # -------------------
    # Data Augmentation
    # -------------------

    hsv_h=0.015,
    hsv_s=0.7,
    hsv_v=0.4,

    degrees=10,

    translate=0.1,

    scale=0.5,

    shear=2,

    perspective=0,

    fliplr=0.5,

    flipud=0.2,

    mosaic=1.0,

    mixup=0.2,

    copy_paste=0.1,

    erasing=0.4,
)

print("\nTraining Finished Successfully!")

# =====================================================
# Best Model
# =====================================================

BEST_MODEL = os.path.join(
    PROJECT,
    NAME,
    "weights",
    "best.pt"
)

print(f"\nBest Model: {BEST_MODEL}")

# =====================================================
# Validation
# =====================================================

# print("\nRunning Validation...")

# best = YOLO(BEST_MODEL)

# metrics = best.val()

# print(metrics)

# # =====================================================
# # Export Model
# # =====================================================

# print("\nExporting Model...")

# best.export(format="onnx")

# print("ONNX Export Complete!")

# # =====================================================
# # Prediction
# # =====================================================

# TEST_FOLDER = "data/test/images"

# if os.path.exists(TEST_FOLDER):

#     print("\nRunning Predictions...")

#     best.predict(

#         source=TEST_FOLDER,

#         save=True,

#         conf=0.25,

#         imgsz=640,

#         project=PROJECT,

#         name="predictions"

#     )

# print("\nAll Tasks Completed Successfully!")