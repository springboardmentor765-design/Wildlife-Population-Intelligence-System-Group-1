import os
from ultralytics import YOLO

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "model", "best.pt")

# Load model only once
model = YOLO(MODEL_PATH)


def predict_image(image_path):
    results = model(image_path)

    detections = []

    for result in results:
        for box in result.boxes:
            cls = int(box.cls[0])
            confidence = float(box.conf[0])

            x1, y1, x2, y2 = map(float, box.xyxy[0])

            detections.append({
                "animal": model.names[cls],
                "class_id": cls,
                "confidence": round(confidence, 4),
                "bbox": {
                    "x1": round(x1, 2),
                    "y1": round(y1, 2),
                    "x2": round(x2, 2),
                    "y2": round(y2, 2)
                }
            })

    return detections
