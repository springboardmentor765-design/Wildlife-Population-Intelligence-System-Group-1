# import os
# import uuid
# import shutil
# import random
# from pathlib import Path
# from fastapi import APIRouter, File, UploadFile, Depends, HTTPException
# from sqlalchemy.orm import Session
# from database.database import get_db
# from database.models import Detection

# router = APIRouter()

# UPLOAD_FOLDER = Path("uploads/audio")
# UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)

# # Mock Phase 2 Engines for Audio
# def get_iucn_status(species_name: str) -> str:
#     endangered_species = ["elephant", "rhino", "tiger", "pangolin", "gorilla", "macaw"]
#     if any(e in species_name.lower() for e in endangered_species):
#         return "Endangered"
#     return "Least Concern"

# def analyze_behavior(species_name: str) -> str:
#     behaviors = ["Calling", "Mating Call", "Warning Signal", "Foraging", "Resting"]
#     return random.choice(behaviors)

# @router.get("/")
# async def audio():
#     return {
#         "module": "Audio API",
#         "status": "Working"
#     }

# @router.post("/upload")
# async def process_audio(
#     file: UploadFile = File(...),
#     db: Session = Depends(get_db)
# ):
#     if not file.content_type.startswith("audio/"):
#         raise HTTPException(
#             status_code=400,
#             detail="Please upload a valid audio file."
#         )

#     filename = f"{uuid.uuid4()}_{file.filename}"
#     input_path = UPLOAD_FOLDER / filename

#     with open(input_path, "wb") as buffer:
#         shutil.copyfileobj(file.file, buffer)

#     # MOCK ML PIPELINE FOR AUDIO
#     mock_lat = -23.9884 + random.uniform(-0.1, 0.1)
#     mock_lng = 31.5547 + random.uniform(-0.1, 0.1)

#     # Randomly select a species that might make sound
#     species_options = ["African Elephant (Trumpet)", "Lion (Roar)", "Macaw (Squawk)", "Chimpanzee (Pant-hoot)", "Leopard (Growl)"]
#     species_name = random.choice(species_options)
#     confidence = round(random.uniform(0.75, 0.99), 2)

#     # Environmental Mock Data
#     env_vegetation = round(random.uniform(40.0, 95.0), 1)
#     env_water = round(random.uniform(10.0, 100.0), 1)
#     env_temp = round(random.uniform(15.0, 35.0), 1)
#     env_forest = round(random.uniform(50.0, 90.0), 1)
#     env_land = random.choice(["Stable", "Stable", "Deforestation", "Reforestation"])

#     behavior = analyze_behavior(species_name)
#     status = get_iucn_status(species_name)

#     source_type = "Audio Recording"

#     db_detection = Detection(
#         image_path=str(input_path), # Using image_path to store file path as there is no audio_path field
#         species_name=species_name,
#         confidence=confidence,
#         location_lat=mock_lat,
#         location_lng=mock_lng,
#         source_type=source_type,
#         vegetation_cover=env_vegetation,
#         water_availability=env_water,
#         temperature=env_temp,
#         forest_density=env_forest,
#         land_use_changes=env_land,
#         behavior=behavior,
#         endangered_status=status
#     )
#     db.add(db_detection)
#     db.commit()

#     return {
#         "success": True,
#         "message": "Audio processed successfully.",
#         "filename": filename,
#         "total_detections": 1,
#         "detections": [{
#             "species": species_name,
#             "confidence": confidence,
#             "source_type": source_type,
#             "behavior": behavior,
#             "endangered_status": status
#         }]
#     }

# import os
# import tempfile
# import pickle

# import librosa
# import numpy as np

# from fastapi import APIRouter, UploadFile, File, HTTPException, Request, Depends
# from sqlalchemy.orm import Session
# from database.database import get_db
# from database.models import Detection
# import random

# router = APIRouter()


# # ----------------------------------------------------
# # Configuration
# # ----------------------------------------------------

# SAMPLE_RATE = 22050
# DURATION = 5
# N_MFCC = 40

# MAX_FILE_SIZE = 20 * 1024 * 1024  # 20 MB

# ALLOWED_EXTENSIONS = {
#     ".wav",
#     ".mp3",
#     ".ogg",
#     ".flac",
#     ".m4a",
# }


# # ----------------------------------------------------
# # Audio Preprocessing
# # ----------------------------------------------------

# def extract_features(file_path: str):
#     """
#     Extract MFCC features from audio.

#     IMPORTANT:
#     This preprocessing must match the preprocessing
#     used in training.py.
#     """

#     try:
#         audio, sr = librosa.load(
#             file_path,
#             sr=SAMPLE_RATE,
#             duration=DURATION,
#         )

#         # Ensure fixed audio length
#         target_length = SAMPLE_RATE * DURATION

#         if len(audio) < target_length:
#             audio = np.pad(
#                 audio,
#                 (0, target_length - len(audio)),
#             )
#         else:
#             audio = audio[:target_length]

#         # MFCC
#         mfcc = librosa.feature.mfcc(
#             y=audio,
#             sr=sr,
#             n_mfcc=N_MFCC,
#         )

#         # Convert variable-length MFCC to fixed-length vector
#         mfcc_features = np.mean(
#             mfcc,
#             axis=1,
#         )

#         return mfcc_features

#     except Exception as e:
#         raise RuntimeError(
#             f"Audio feature extraction failed: {str(e)}"
#         )


# # ----------------------------------------------------
# # Prediction
# # ----------------------------------------------------

# def predict_audio(
#     file_path: str,
#     model,
#     label_encoder,
#     scaler=None,
# ):
#     """
#     Run audio classification prediction.
#     """

#     features = extract_features(file_path)

#     # Shape: (1, number_of_features)
#     features = features.reshape(1, -1)

#     # Apply scaler if available
#     if scaler is not None:
#         features = scaler.transform(features)

#     # Model prediction
#     prediction = model.predict(
#         features,
#         verbose=0,
#     )

#     # Get predicted class
#     predicted_index = int(
#         np.argmax(prediction[0])
#     )

#     confidence = float(
#         prediction[0][predicted_index]
#     )

#     # Convert class index -> animal name
#     predicted_label = label_encoder.inverse_transform(
#         [predicted_index]
#     )[0]

#     return {
#         "animal": str(predicted_label),
#         "confidence": round(confidence * 100, 2),
#         "class_index": predicted_index,
#     }


# # ----------------------------------------------------
# # Audio Prediction API
# # ----------------------------------------------------

# @router.post("/predict")
# async def predict(
#     request: Request,
#     file: UploadFile = File(...),
#     db: Session = Depends(get_db),
# ):
#     """
#     Upload an audio file and predict the animal sound.
#     """

#     # ------------------------------------------------
#     # Validate file
#     # ------------------------------------------------

#     if not file.filename:
#         raise HTTPException(
#             status_code=400,
#             detail="No audio file provided.",
#         )

#     extension = os.path.splitext(
#         file.filename
#     )[1].lower()

#     if extension not in ALLOWED_EXTENSIONS:
#         raise HTTPException(
#             status_code=400,
#             detail=(
#                 "Unsupported audio format. "
#                 "Allowed formats: WAV, MP3, OGG, FLAC, M4A."
#             ),
#         )

#     # ------------------------------------------------
#     # Read uploaded file
#     # ------------------------------------------------

#     file_content = await file.read()

#     if len(file_content) > MAX_FILE_SIZE:
#         raise HTTPException(
#             status_code=400,
#             detail="Audio file is too large. Maximum size is 20 MB.",
#         )

#     temp_path = None

#     try:

#         # ------------------------------------------------
#         # Create temporary file
#         # ------------------------------------------------

#         with tempfile.NamedTemporaryFile(
#             delete=False,
#             suffix=extension,
#         ) as temp_file:

#             temp_file.write(file_content)
#             temp_path = temp_file.name

#         # ------------------------------------------------
#         # Get models from FastAPI app state
#         # ------------------------------------------------

#         audio_model = getattr(
#             request.app.state,
#             "audio_model",
#             None,
#         )

#         label_encoder = getattr(
#             request.app.state,
#             "label_encoder",
#             None,
#         )

#         scaler = getattr(
#             request.app.state,
#             "scaler",
#             None,
#         )

#         # ------------------------------------------------
#         # Check model
#         # ------------------------------------------------

#         if audio_model is None:
#             raise HTTPException(
#                 status_code=503,
#                 detail="Audio model is not loaded.",
#             )

#         if label_encoder is None:
#             raise HTTPException(
#                 status_code=503,
#                 detail="Label encoder is not loaded.",
#             )

#         # ------------------------------------------------
#         # Prediction
#         # ------------------------------------------------

#         result = predict_audio(
#             file_path=temp_path,
#             model=audio_model,
#             label_encoder=label_encoder,
#             scaler=scaler,
#         )

#         # ------------------------------------------------
#         # Save to Database
#         # ------------------------------------------------
        
#         # MOCK Environmental Data
#         mock_lat = -23.9884 + random.uniform(-0.1, 0.1)
#         mock_lng = 31.5547 + random.uniform(-0.1, 0.1)
        
#         env_vegetation = round(random.uniform(40.0, 95.0), 1)
#         env_water = round(random.uniform(10.0, 100.0), 1)
#         env_temp = round(random.uniform(15.0, 35.0), 1)
#         env_forest = round(random.uniform(50.0, 90.0), 1)
#         env_land = random.choice(["Stable", "Stable", "Deforestation", "Reforestation"])

#         endangered_species = ["elephant", "rhino", "tiger", "pangolin", "gorilla", "macaw"]
#         status = "Endangered" if any(e in result['animal'].lower() for e in endangered_species) else "Least Concern"
#         behaviors = ["Calling", "Mating Call", "Warning Signal", "Foraging", "Resting"]
#         behavior = random.choice(behaviors)

#         db_detection = Detection(
#             image_path=file.filename,
#             species_name=result['animal'],
#             confidence=result['confidence'] / 100.0,
#             location_lat=mock_lat,
#             location_lng=mock_lng,
#             source_type="Audio Recording",
#             vegetation_cover=env_vegetation,
#             water_availability=env_water,
#             temperature=env_temp,
#             forest_density=env_forest,
#             land_use_changes=env_land,
#             behavior=behavior,
#             endangered_status=status
#         )
#         db.add(db_detection)
#         db.commit()

#         # ------------------------------------------------
#         # Response
#         # ------------------------------------------------

#         return {
#             "success": True,
#             "filename": file.filename,
#             "total_detections": 1,
#             "detections": [{
#                 "species": result['animal'],
#                 "confidence": result['confidence'] / 100.0,
#                 "source_type": "Audio Recording",
#                 "behavior": behavior,
#                 "iucn_status": status
#             }]
#         }

#     except HTTPException:
#         raise

#     except Exception as e:

#         raise HTTPException(
#             status_code=500,
#             detail=f"Audio prediction failed: {str(e)}",
#         )

#     finally:

#         # ------------------------------------------------
#         # Delete temporary file
#         # ------------------------------------------------

#         if temp_path and os.path.exists(temp_path):
#             os.remove(temp_path)


# # ----------------------------------------------------
# # Audio Health Check
# # ----------------------------------------------------

# @router.get("/health")
# async def audio_health(request: Request):

#     audio_model = getattr(
#         request.app.state,
#         "audio_model",
#         None,
#     )

#     label_encoder = getattr(
#         request.app.state,
#         "label_encoder",
#         None,
#     )

#     scaler = getattr(
#         request.app.state,
#         "scaler",
#         None,
#     )

#     return {
#         "success": True,
#         "service": "Audio Classification",
#         "model_loaded": audio_model is not None,
#         "label_encoder_loaded": label_encoder is not None,
#         "scaler_loaded": scaler is not None,
#     }







import os
import tempfile
import random

import librosa
import numpy as np

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException,
    Request,
    Depends,
)

from sqlalchemy.orm import Session

from database.database import get_db
from database.models import AudioPrediction


router = APIRouter()


# ----------------------------------------------------
# Configuration
# ----------------------------------------------------

SAMPLE_RATE = 22050
DURATION = 5
N_MFCC = 40

MAX_FILE_SIZE = 20 * 1024 * 1024  # 20 MB

ALLOWED_EXTENSIONS = {
    ".wav",
    ".mp3",
    ".ogg",
    ".flac",
    ".m4a",
}


# ----------------------------------------------------
# Audio Feature Extraction
# ----------------------------------------------------

def extract_features(file_path: str):

    try:

        audio, sr = librosa.load(
            file_path,
            sr=SAMPLE_RATE,
            duration=DURATION,
        )

        target_length = SAMPLE_RATE * DURATION

        # Pad short audio
        if len(audio) < target_length:

            audio = np.pad(
                audio,
                (0, target_length - len(audio)),
            )

        # Trim long audio
        else:

            audio = audio[:target_length]

        # MFCC
        mfcc = librosa.feature.mfcc(
            y=audio,
            sr=sr,
            n_mfcc=N_MFCC,
        )

        # Average across time
        features = np.mean(
            mfcc,
            axis=1,
        )

        return features

    except Exception as e:

        raise RuntimeError(
            f"Audio feature extraction failed: {str(e)}"
        )


# ----------------------------------------------------
# Audio Prediction
# ----------------------------------------------------

def predict_audio(
    file_path,
    model,
    label_encoder,
    scaler=None,
):

    # Extract features
    features = extract_features(file_path)

    # Convert to 2D
    features = features.reshape(1, -1)

    # Apply scaler
    if scaler is not None:

        features = scaler.transform(features)

    # Model prediction
    prediction = model.predict(
        features,
        verbose=0,
    )

    # Predicted class
    predicted_index = int(
        np.argmax(prediction[0])
    )

    # Confidence
    confidence = float(
        prediction[0][predicted_index]
    )

    # Class index → animal name
    predicted_label = label_encoder.inverse_transform(
        [predicted_index]
    )[0]

    return {
        "animal": str(predicted_label),
        "confidence": round(
            confidence * 100,
            2,
        ),
        "class_index": predicted_index,
    }


# ----------------------------------------------------
# Audio Upload + Prediction
# ----------------------------------------------------

@router.post("/upload")
async def process_audio(
    request: Request,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):

    # ------------------------------------------------
    # Validate filename
    # ------------------------------------------------

    if not file.filename:

        raise HTTPException(
            status_code=400,
            detail="No audio file provided.",
        )


    # ------------------------------------------------
    # Validate extension
    # ------------------------------------------------

    extension = os.path.splitext(
        file.filename
    )[1].lower()

    if extension not in ALLOWED_EXTENSIONS:

        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported audio format. "
                "Allowed formats: WAV, MP3, OGG, FLAC, M4A."
            ),
        )


    # ------------------------------------------------
    # Read file
    # ------------------------------------------------

    file_content = await file.read()


    # ------------------------------------------------
    # Validate file size
    # ------------------------------------------------

    if len(file_content) > MAX_FILE_SIZE:

        raise HTTPException(
            status_code=400,
            detail="Audio file is too large. Maximum size is 20 MB.",
        )


    temp_path = None

    try:

        # ------------------------------------------------
        # Create temporary audio file
        # ------------------------------------------------

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=extension,
        ) as temp_file:

            temp_file.write(file_content)

            temp_path = temp_file.name


        # ------------------------------------------------
        # Get models from FastAPI
        # ------------------------------------------------

        audio_model = getattr(
            request.app.state,
            "audio_model",
            None,
        )

        label_encoder = getattr(
            request.app.state,
            "label_encoder",
            None,
        )

        scaler = getattr(
            request.app.state,
            "scaler",
            None,
        )


        # ------------------------------------------------
        # Check Audio Model
        # ------------------------------------------------

        if audio_model is None:

            raise HTTPException(
                status_code=503,
                detail="Audio model is not loaded.",
            )


        # ------------------------------------------------
        # Check Label Encoder
        # ------------------------------------------------

        if label_encoder is None:

            raise HTTPException(
                status_code=503,
                detail="Label encoder is not loaded.",
            )


        # ------------------------------------------------
        # Predict
        # ------------------------------------------------

        result = predict_audio(
            file_path=temp_path,
            model=audio_model,
            label_encoder=label_encoder,
            scaler=scaler,
        )


        # ------------------------------------------------
        # Environmental Data
        # ------------------------------------------------

        mock_lat = (
            -23.9884
            + random.uniform(-0.1, 0.1)
        )

        mock_lng = (
            31.5547
            + random.uniform(-0.1, 0.1)
        )

        env_vegetation = round(
            random.uniform(40.0, 95.0),
            1,
        )

        env_water = round(
            random.uniform(10.0, 100.0),
            1,
        )

        env_temp = round(
            random.uniform(15.0, 35.0),
            1,
        )

        env_forest = round(
            random.uniform(50.0, 90.0),
            1,
        )

        env_land = random.choice(
            [
                "Stable",
                "Stable",
                "Deforestation",
                "Reforestation",
            ]
        )


        # ------------------------------------------------
        # Animal Status
        # ------------------------------------------------

        endangered_species = [
            "elephant",
            "rhino",
            "tiger",
            "pangolin",
            "gorilla",
            "macaw",
        ]

        species_name = result["animal"]

        status = (
            "Endangered"
            if any(
                animal in species_name.lower()
                for animal in endangered_species
            )
            else "Least Concern"
        )


        # ------------------------------------------------
        # Behavior
        # ------------------------------------------------

        behaviors = [
            "Calling",
            "Mating Call",
            "Warning Signal",
            "Foraging",
            "Resting",
        ]

        behavior = random.choice(
            behaviors
        )


        # ------------------------------------------------
        # Save Detection
        # ------------------------------------------------

        db_prediction = AudioPrediction(
            file_path=str(input_path) if 'input_path' in locals() else file.filename,
            file_name=file.filename,
            species_name=species_name,
            confidence=(result["confidence"] / 100.0),
            class_index=result.get("class_index"),
            source_type="Audio Recording",
            location_lat=-23.988, # Default or extracted
            location_lng=31.554,
            behavior=behavior,
            endangered_status=status,
        )


        db.add(db_prediction)
        db.commit()


        # ------------------------------------------------
        # API Response
        # ------------------------------------------------

        return {

            "success": True,

            "message": "Audio processed successfully.",

            "filename": file.filename,

            "total_detections": 1,

            "detections": [

                {

                    "species": species_name,

                    "confidence": (
                        result["confidence"] / 100.0
                    ),

                    "source_type": "Audio Recording",

                    "behavior": behavior,

                    "iucn_status": status,
                }

            ],
        }


    except HTTPException:

        raise


    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Audio prediction failed: {str(e)}",
        )


    finally:

        # ------------------------------------------------
        # Remove temporary file
        # ------------------------------------------------

        if (
            temp_path
            and os.path.exists(temp_path)
        ):

            os.remove(temp_path)


# ----------------------------------------------------
# Audio Health
# ----------------------------------------------------

@router.get("/health")
async def audio_health(
    request: Request,
):

    audio_model = getattr(
        request.app.state,
        "audio_model",
        None,
    )

    label_encoder = getattr(
        request.app.state,
        "label_encoder",
        None,
    )

    scaler = getattr(
        request.app.state,
        "scaler",
        None,
    )

    return {

        "success": True,

        "service": "Audio Classification",

        "model_loaded": (
            audio_model is not None
        ),

        "label_encoder_loaded": (
            label_encoder is not None
        ),

        "scaler_loaded": (
            scaler is not None
        ),
    }

# ----------------------------------------------------
# CRUD API for Audio Predictions
# ----------------------------------------------------

@router.get("/all")
def get_all_audio_predictions(db: Session = Depends(get_db)):
    predictions = db.query(AudioPrediction).order_by(AudioPrediction.created_at.desc()).all()
    return predictions

@router.get("/{id}")
def get_audio_prediction(id: int, db: Session = Depends(get_db)):
    prediction = db.query(AudioPrediction).filter(AudioPrediction.id == id).first()
    if not prediction:
        raise HTTPException(status_code=404, detail="Audio prediction not found")
    return prediction

@router.delete("/{id}")
def delete_audio_prediction(id: int, db: Session = Depends(get_db)):
    prediction = db.query(AudioPrediction).filter(AudioPrediction.id == id).first()
    if not prediction:
        raise HTTPException(status_code=404, detail="Audio prediction not found")
    db.delete(prediction)
    db.commit()
    return {"success": True, "message": "Audio prediction deleted"}