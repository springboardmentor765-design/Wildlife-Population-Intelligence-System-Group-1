from pathlib import Path
import shutil
import uuid
import os

from fastapi import APIRouter, File, HTTPException, UploadFile, Depends, Form, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from database.database import get_db
from database.models import Detection
import json
import uuid
import shutil
import cv2
from ultralytics import YOLO
from pathlib import Path
from datetime import datetime

# Mock Phase 2 Engines
def get_iucn_status(species_name: str) -> str:
    endangered_species = ["elephant", "rhino", "tiger", "pangolin", "gorilla"]
    if any(e in species_name.lower() for e in endangered_species):
        return "Endangered"
    return "Least Concern"

def analyze_behavior(species_name: str) -> str:
    behaviors = ["Foraging", "Resting", "Moving", "Socializing", "Alert"]
    # Actually just default to a static string if we want to remove 'random'
    # But behavior could be derived from rules. For now, just return a deterministic behavior.
    return "Moving"

router = APIRouter()

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
async def detect_image(
    request: Request,
    file: UploadFile = File(...), 
    source_type: str = Form("Camera Trap Image"), 
    db: Session = Depends(get_db)
):

    # Non-image source types (Audio, GPS, Environmental) bypass YOLO vision model
    is_non_image = source_type in ["Audio Recording", "GPS Device Data", "Environmental Sensor"]
    
    if not is_non_image and not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Please upload an image file for vision-based detection."
        )

    # Unique filename
    filename = f"{uuid.uuid4()}_{file.filename}"

    input_path = UPLOAD_FOLDER / filename

    # Save uploaded image
    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Run YOLO Prediction (only for images)
    detections = []
    
    if is_non_image:
        # Avoid random coordinates
        species_name = "Bird (Acoustic Call)" if source_type == "Audio Recording" else "Telemetry Data"
        behavior = analyze_behavior(species_name)
        status = get_iucn_status(species_name)
        
        db_detection = Detection(
            image_path=str(input_path),
            species_name=species_name,
            confidence=0.95,
            location_lat=-23.988,
            location_lng=31.554,
            source_type=source_type,
            vegetation_cover=50.0,
            water_availability=50.0,
            temperature=25.0,
            forest_density=50.0,
            land_use_changes="Stable",
            behavior=behavior,
            endangered_status=status
        )
        db.add(db_detection)
        db.commit()
        
        return {
            "success": True,
            "message": f"Processed {source_type} data successfully.",
            "filename": filename,
            "total_detections": 1,
            "detections": [{
                "species": species_name,
                "confidence": 0.95,
                "bounding_box": None,
                "source_type": source_type
            }]
        }

    yolo_model = request.app.state.yolo_model
    results = yolo_model.predict(
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
                bbox_dict = {"x1": round(x1, 2), "y1": round(y1, 2), "x2": round(x2, 2), "y2": round(y2, 2)}
                
                species_name = yolo_model.names[class_id]
                behavior = analyze_behavior(species_name)
                status = get_iucn_status(species_name)

                detections.append({
                    "species": species_name,
                    "confidence": round(confidence, 4),
                    "bounding_box": bbox_dict,
                    "behavior": behavior,
                    "endangered_status": status
                })

                # Static default location for image detections since we have no GPS metadata in standard upload
                mock_lat = -23.9884
                mock_lng = 31.5547

                # Save detection to SQLite/Postgres
                db_detection = Detection(
                    image_path=str(output_path),
                    species_name=species_name,
                    confidence=confidence,
                    location_lat=mock_lat,
                    location_lng=mock_lng,
                    source_type=source_type,
                    bounding_box=json.dumps(bbox_dict),
                    behavior=behavior,
                    endangered_status=status
                )
                db.add(db_detection)

        db.commit()

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
async def detect_video(request: Request, file: UploadFile = File(...)):

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

        yolo_model = request.app.state.yolo_model
        results = yolo_model.predict(
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

                label = yolo_model.names[cls]

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

def generate_frames(yolo_model):
    camera = cv2.VideoCapture(0)
    if not camera.isOpened():
        raise RuntimeError("Cannot access webcam")

    while True:
        success, frame = camera.read()
        if not success:
            break

        results = yolo_model.predict(
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

@router.get("/webcam")
def webcam_detection(request: Request):
    return StreamingResponse(
        generate_frames(request.app.state.yolo_model),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

# --------------------------------------------------
# CRUD API for Detections
# --------------------------------------------------

@router.get("/all")
def get_all_detections(db: Session = Depends(get_db)):
    detections = db.query(Detection).order_by(Detection.created_at.desc()).all()
    return detections

@router.get("/{id}")
def get_detection(id: int, db: Session = Depends(get_db)):
    detection = db.query(Detection).filter(Detection.id == id).first()
    if not detection:
        raise HTTPException(status_code=404, detail="Detection not found")
    return detection

@router.delete("/{id}")
def delete_detection(id: int, db: Session = Depends(get_db)):
    detection = db.query(Detection).filter(Detection.id == id).first()
    if not detection:
        raise HTTPException(status_code=404, detail="Detection not found")
    db.delete(detection)
    db.commit()
    return {"success": True, "message": "Detection deleted"}






