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





from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO

from api.detection import router as detection_router
from api.dashboard import router as dashboard_router
from api.reports import router as reports_router
from api.audio import router as audio_router
from api.map import router as map_router
from api.auth import router as auth_router

model = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global model

    print("=" * 60)
    print("Loading YOLO11 Model...")

    try:
        model = YOLO("models/best.pt")
        print("YOLO Model Loaded Successfully")
    except Exception as e:
        print(e)

    print("=" * 60)

    yield

    print("Server Closed")


app = FastAPI(
    title="Wildlife Population Intelligence System",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "message": "Wildlife Population Intelligence System API",
        "status": "Running",
        "model": "YOLO11"
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "model_loaded": model is not None
    }


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