from fastapi import FastAPI, UploadFile, File
import os
import shutil
from backend.predict import predict_image
app = FastAPI()

BASE_DIR = os.path.dirname(__file__)
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.get("/")
def home():
    return {
        "message": "Wildlife Population Intelligence Backend is running!"
    }

@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    predictions = predict_image(file_path)

    return {
        "filename": file.filename,
        "detections": predictions
    }