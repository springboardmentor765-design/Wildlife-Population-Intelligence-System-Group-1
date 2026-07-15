from pathlib import Path
import shutil
import uuid

import cv2
from fastapi import APIRouter, File, HTTPException, UploadFile
from ultralytics import YOLO
from fastapi.responses import StreamingResponse

router = APIRouter()

# --------------------------------------------------
# Configuration
# --------------------------------------------------

MODEL_PATH = "models/best.pt"

# UPLOAD_FOLDER = Path("uploads/images")
# RESULT_FOLDER = Path("results/images")

# UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)
# RESULT_FOLDER.mkdir(parents=True, exist_ok=True)

model = YOLO(MODEL_PATH)

# --------------------------------------------------
# Home
# --------------------------------------------------

@router.get("/")
def detection_home():
    return {
        "module": "Detection API",
        "status": "Running"
    }

# ======================================================
# Image Detection API
# ======================================================


UPLOAD_FOLDER = Path("uploads/images")
RESULT_FOLDER = Path("results/images")

UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)
RESULT_FOLDER.mkdir(parents=True, exist_ok=True)



@router.post("/image")
async def detect_image(file: UploadFile = File(...)):

    # Check file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Please upload an image file."
        )

    # Unique filename
    filename = f"{uuid.uuid4()}_{file.filename}"

    input_path = UPLOAD_FOLDER / filename

    # Save uploaded image
    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Run YOLO Prediction
    results = model.predict(
        source=str(input_path),
        conf=0.25,
        save=False,
        verbose=False
    )

    detections = []

    for result in results:

        # Draw Bounding Boxes
        annotated_image = result.plot()

        output_path = RESULT_FOLDER / filename

        cv2.imwrite(str(output_path), annotated_image)

        # Extract Detection Results
        if result.boxes is not None:

            for box in result.boxes:

                class_id = int(box.cls.item())

                confidence = float(box.conf.item())

                x1, y1, x2, y2 = box.xyxy[0].tolist()

                detections.append({

                    "species": model.names[class_id],

                    "confidence": round(confidence, 4),

                    "bounding_box": {

                        "x1": round(x1, 2),
                        "y1": round(y1, 2),
                        "x2": round(x2, 2),
                        "y2": round(y2, 2)

                    }

                })

    return {

        "success": True,

        "message": "Detection completed successfully.",

        "filename": filename,

        "total_detections": len(detections),

        "detections": detections,

        "annotated_image": str(output_path)

    }



# from pathlib import Path
# import shutil
# import uuid

# import cv2
# from fastapi import APIRouter, File, HTTPException, UploadFile
# from ultralytics import YOLO

# router = APIRouter()

# # ----------------------------------------
# # Configuration
# # ----------------------------------------

# MODEL_PATH = "models/best.pt"

UPLOAD_FOLDER = Path("uploads/videos")
RESULT_FOLDER = Path("results/videos")

UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)
RESULT_FOLDER.mkdir(parents=True, exist_ok=True)

# model = YOLO(MODEL_PATH)

# ----------------------------------------
# Video Detection
# ----------------------------------------

@router.post("/video")
async def detect_video(file: UploadFile = File(...)):

    if not file.content_type.startswith("video/"):
        raise HTTPException(
            status_code=400,
            detail="Upload a valid video file."
        )

    filename = f"{uuid.uuid4()}_{file.filename}"

    input_video = UPLOAD_FOLDER / filename

    with open(input_video, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    cap = cv2.VideoCapture(str(input_video))

    if not cap.isOpened():
        raise HTTPException(
            status_code=400,
            detail="Cannot open uploaded video."
        )

    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)

    output_video = RESULT_FOLDER / filename

    writer = cv2.VideoWriter(
        str(output_video),
        cv2.VideoWriter_fourcc(*"mp4v"),
        fps,
        (width, height)
    )

    total_frames = 0
    total_detections = 0

    species_count = {}

    while True:

        ret, frame = cap.read()

        if not ret:
            break

        total_frames += 1

        results = model.predict(
            source=frame,
            conf=0.25,
            verbose=False
        )

        result = results[0]

        annotated = result.plot()

        writer.write(annotated)

        if result.boxes is not None:

            total_detections += len(result.boxes)

            for box in result.boxes:

                cls = int(box.cls.item())

                label = model.names[cls]

                species_count[label] = (
                    species_count.get(label, 0) + 1
                )

    cap.release()
    writer.release()

    return {

        "success": True,

        "message": "Video processed successfully.",

        "video_name": filename,

        "processed_video": str(output_video),

        "frames_processed": total_frames,

        "total_detections": total_detections,

        "species_detected": species_count

    }





# -------------------------------------------------------
# Webcam Generator
# -------------------------------------------------------

def generate_frames():

    camera = cv2.VideoCapture(0)

    if not camera.isOpened():
        raise RuntimeError("Cannot access webcam")

    while True:

        success, frame = camera.read()

        if not success:
            break

        # YOLO Prediction
        results = model.predict(
            source=frame,
            conf=0.25,
            verbose=False
        )

        annotated = results[0].plot()

        _, buffer = cv2.imencode(".jpg", annotated)

        frame = buffer.tobytes()

        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n"
            + frame +
            b"\r\n"
        )

    camera.release()

# -------------------------------------------------------
# Live Webcam API
# -------------------------------------------------------

@router.get("/webcam")
def webcam_detection():

    return StreamingResponse(
        generate_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )






