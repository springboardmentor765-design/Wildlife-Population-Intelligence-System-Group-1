from fastapi import FastAPI, UploadFile, File
import os
import shutil
from backend.predict import predict_image
from backend.predict_audio import predict_audio
from backend.predict_reid import predict_reid
app = FastAPI()

BASE_DIR = os.path.dirname(__file__)

IMAGE_UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads", "images")
AUDIO_UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads", "audio")

os.makedirs(IMAGE_UPLOAD_FOLDER, exist_ok=True)
os.makedirs(AUDIO_UPLOAD_FOLDER, exist_ok=True)

@app.get("/")
def home():
    return {
        "message": "Wildlife Population Intelligence Backend is running!"
    }

@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):

    file_path = os.path.join(IMAGE_UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    predictions = predict_image(file_path)

    return {
        "filename": file.filename,
        "total_animals": len(predictions),
        "detections": predictions
    }

@app.post("/upload-audio")
async def upload_audio(file: UploadFile = File(...)):

    file_path = os.path.join(AUDIO_UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    prediction = predict_audio(file_path)

    return {
        "filename": file.filename,
        "prediction": prediction
    }

@app.post("/re-identify")
async def reidentify(file: UploadFile = File(...)):

    file_path = os.path.join(
        IMAGE_UPLOAD_FOLDER,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = predict_reid(file_path)

    return {
        "filename": file.filename,
        **result
    }