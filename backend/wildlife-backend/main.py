# from contextlib import asynccontextmanager

# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from ultralytics import YOLO

# # ----------------------------------------------------
# # Load YOLO Model Once
# # ----------------------------------------------------

# model = None


# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     global model

#     print("=" * 60)
#     print("Loading YOLO Model...")

#     try:
#         model = YOLO("models/best.pt")
#         print("✅ YOLO Model Loaded Successfully")
#     except Exception as e:
#         print(f"❌ Failed to load YOLO Model: {e}")

#     print("=" * 60)

#     yield

#     print("Shutting down Wildlife AI Backend...")


# # ----------------------------------------------------
# # FastAPI App
# # ----------------------------------------------------

# app = FastAPI(
#     title="Wildlife Population Intelligence System API",
#     description="Backend API for AI-powered wildlife detection and biodiversity analytics",
#     version="1.0.0",
#     lifespan=lifespan,
# )

# # ----------------------------------------------------
# # CORS
# # ----------------------------------------------------

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:3000",
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ----------------------------------------------------
# # Home
# # ----------------------------------------------------

# @app.get("/")
# async def root():
#     return {
#         "message": "Wildlife Population Intelligence System API",
#         "status": "Running",
#         "model": "YOLO11",
#     }


# # ----------------------------------------------------
# # Health Check
# # ----------------------------------------------------

# @app.get("/health")
# async def health():
#     return {
#         "status": "healthy",
#         "model_loaded": model is not None,
#     }


# ----------------------------------------------------
# Test Detection Endpoint
# ----------------------------------------------------

# @app.get("/api/detection/test")
# async def detection_test():
#     return {
#         "success": True,
#         "message": "Detection API is working.",
#     }





# from contextlib import asynccontextmanager
# import os

# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from ultralytics import YOLO

# from api.detection import router as detection_router
# from api.dashboard import router as dashboard_router
# from api.reports import router as reports_router
# from api.audio import router as audio_router
# from api.map import router as map_router
# from api.auth import router as auth_router
# from api.survey import router as survey_router
# from api.alerts import router as alerts_router
# from api.population import router as population_router

# from database.database import engine
# from database.models import Base

# Base.metadata.create_all(bind=engine)

# model = None


# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     global model

#     print("=" * 60)
#     print("Loading YOLO11 Model...")

#     try:
#         model = YOLO("models/best.pt")
#         print("YOLO Model Loaded Successfully")
#     except Exception as e:
#         print(e)

#     print("=" * 60)

#     yield

#     print("Server Closed")


# app = FastAPI(
#     title="Wildlife Population Intelligence System",
#     version="1.0.0",
#     lifespan=lifespan,
# )

# allowed_origins_raw = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
# allowed_origins = [origin.strip() for origin in allowed_origins_raw.split(",") if origin.strip()]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=allowed_origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# @app.get("/")
# async def root():
#     return {
#         "message": "Wildlife Population Intelligence System API",
#         "status": "Running",
#         "model": "YOLO11"
#     }


# @app.get("/health")
# async def health():
#     return {
#         "status": "healthy",
#         "model_loaded": model is not None
#     }


# app.include_router(
#     detection_router,
#     prefix="/api/detection",
#     tags=["Detection"]
# )

# app.include_router(
#     dashboard_router,
#     prefix="/api/dashboard",
#     tags=["Dashboard"]
# )

# app.include_router(
#     reports_router,
#     prefix="/api/reports",
#     tags=["Reports"]
# )

# app.include_router(
#     audio_router,
#     prefix="/api/audio",
#     tags=["Audio"]
# )

# app.include_router(
#     map_router,
#     prefix="/api/map",
#     tags=["Map"]
# )

# app.include_router(
#     auth_router,
#     prefix="/api/auth",
#     tags=["Authentication"]
# )

# app.include_router(
#     survey_router,
#     prefix="/api/survey",
#     tags=["Survey"]
# )

# app.include_router(
#     alerts_router,
#     prefix="/api/alerts",
#     tags=["Alerts"]
# )

# app.include_router(
#     population_router,
#     prefix="/api/population",
#     tags=["Population"]
# )



from contextlib import asynccontextmanager
import os
import joblib

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from tensorflow.keras.models import load_model

from api.detection import router as detection_router
from api.dashboard import router as dashboard_router
from api.reports import router as reports_router
from api.audio import router as audio_router
from api.map import router as map_router
from api.auth import router as auth_router
from api.survey import router as survey_router
from api.alerts import router as alerts_router
from api.population import router as population_router

from database.database import engine
from database.models import Base


# ----------------------------------------------------
# Database
# ----------------------------------------------------

Base.metadata.create_all(bind=engine)


# ----------------------------------------------------
# AI Models
# ----------------------------------------------------

yolo_model = None
audio_model = None
label_encoder = None
scaler = None


# ----------------------------------------------------
# Load AI Models
# ----------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):

    global yolo_model
    global audio_model
    global label_encoder
    global scaler

    print("=" * 60)
    print("Loading AI Models...")
    print("=" * 60)

    # ------------------------------------------------
    # Load YOLO Model
    # ------------------------------------------------

    try:
        print("Loading YOLO11 model...")

        yolo_model = YOLO("models/best.pt")

        print("✅ YOLO11 Model Loaded Successfully")

    except Exception as e:
        print(f"❌ Failed to load YOLO model: {e}")


    # ------------------------------------------------
    # Load Audio Classification Model
    # ------------------------------------------------

    try:
        print("Loading Audio Classification Model...")

        audio_model = load_model(
            "models/best_model.keras"
        )

        print("✅ Audio Model Loaded Successfully")

    except Exception as e:
        print(f"❌ Failed to load Audio Model: {e}")


    # ------------------------------------------------
    # Load Label Encoder
    # ------------------------------------------------

    try:
        print("Loading Audio Label Encoder...")

        label_encoder = joblib.load(
            "models/label_encoder.pkl"
        )

        print("✅ Audio Label Encoder Loaded Successfully")

    except Exception as e:
        print(f"❌ Failed to load Label Encoder: {e}")


    # ------------------------------------------------
    # Load Scaler
    # ------------------------------------------------

    try:
        print("Loading Audio Scaler...")

        scaler = joblib.load(
            "models/scaler.pkl"
        )

        print("✅ Audio Scaler Loaded Successfully")

    except Exception as e:
        print(f"⚠️ Failed to load Scaler: {e}")


    # ------------------------------------------------
    # Store Models in FastAPI App State
    # ------------------------------------------------

    app.state.yolo_model = yolo_model
    app.state.audio_model = audio_model
    app.state.label_encoder = label_encoder
    app.state.scaler = scaler


    # ------------------------------------------------
    # Model Status
    # ------------------------------------------------

    print("=" * 60)
    print("AI Models Initialization Complete")
    print("=" * 60)

    print(
        f"YOLO Model       : {'✅ Loaded' if yolo_model else '❌ Failed'}"
    )

    print(
        f"Audio Model      : {'✅ Loaded' if audio_model else '❌ Failed'}"
    )

    print(
        f"Label Encoder    : {'✅ Loaded' if label_encoder else '❌ Failed'}"
    )

    print(
        f"Scaler           : {'✅ Loaded' if scaler else '❌ Failed'}"
    )

    print("=" * 60)

    yield

    print("Server Closed")


# ----------------------------------------------------
# FastAPI App
# ----------------------------------------------------

app = FastAPI(
    title="Wildlife Population Intelligence System",
    description="AI-powered wildlife detection and audio classification backend",
    version="1.0.0",
    lifespan=lifespan,
)


# ----------------------------------------------------
# CORS
# ----------------------------------------------------

allowed_origins_raw = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000"
)

allowed_origins = [
    origin.strip()
    for origin in allowed_origins_raw.split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----------------------------------------------------
# Home
# ----------------------------------------------------

@app.get("/")
async def root():

    return {
        "message": "Wildlife Population Intelligence System API",
        "status": "Running",
        "models": {
            "image": "YOLO11",
            "audio": "Animal Sound Classifier"
        }
    }


# ----------------------------------------------------
# Health Check
# ----------------------------------------------------

@app.get("/health")
async def health():

    return {
        "status": "healthy",

        "models": {
            "yolo_loaded": yolo_model is not None,
            "audio_loaded": audio_model is not None,
            "label_encoder_loaded": label_encoder is not None,
            "scaler_loaded": scaler is not None,
        }
    }


# ----------------------------------------------------
# Routers
# ----------------------------------------------------

app.include_router(
    detection_router,
    prefix="/api/detection",
    tags=["Detection"]
)

app.include_router(
    dashboard_router,
    prefix="/api/dashboard",
    tags=["Dashboard"]
)

app.include_router(
    reports_router,
    prefix="/api/reports",
    tags=["Reports"]
)

app.include_router(
    audio_router,
    prefix="/api/audio",
    tags=["Audio"]
)

app.include_router(
    map_router,
    prefix="/api/map",
    tags=["Map"]
)

app.include_router(
    auth_router,
    prefix="/api/auth",
    tags=["Authentication"]
)

app.include_router(
    survey_router,
    prefix="/api/survey",
    tags=["Survey"]
)

app.include_router(
    alerts_router,
    prefix="/api/alerts",
    tags=["Alerts"]
)

app.include_router(
    population_router,
    prefix="/api/population",
    tags=["Population"]
)