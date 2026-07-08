from ultralytics import YOLO

# Load model only once
model = YOLO("backend/model/best.pt")


def predict_image(image_path):
    results = model(image_path)

    detections = []

    for result in results:
        for box in result.boxes:
            cls = int(box.cls[0])
            confidence = float(box.conf[0])

            detections.append({
                "animal": model.names[cls],
                "confidence": round(confidence, 2)
            })

    return detections