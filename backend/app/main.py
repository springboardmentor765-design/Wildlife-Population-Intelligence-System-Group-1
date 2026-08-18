from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.base import BaseHTTPMiddleware
import logging
import time

from app.database import Base, engine, ensure_columns
from app.config import settings, UPLOAD_DIR
from app.routers import auth, users, species, images, audio, population, surveys, intelligence
from app.seed import seed

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger("wildlife.gateway")

Base.metadata.create_all(bind=engine)
ensure_columns()
seed()


class GatewayLogMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        started = time.perf_counter()
        response = await call_next(request)
        elapsed_ms = (time.perf_counter() - started) * 1000
        logger.info("%s %s -> %s (%.1f ms)", request.method, request.url.path, response.status_code, elapsed_ms)
        return response


app = FastAPI(
    title="Wildlife Population Intelligence System",
    description="API Gateway for wildlife monitoring, image/audio analysis, and conservation intelligence.",
    version="1.0.0",
)

app.add_middleware(GatewayLogMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory=str(UPLOAD_DIR)), name="static")

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(species.router)
app.include_router(images.router)
app.include_router(audio.router)
app.include_router(population.router)
app.include_router(surveys.router)
app.include_router(intelligence.router)


@app.get("/")
def root():
    return {
        "status": "ok",
        "service": "Wildlife Population Intelligence System API Gateway",
        "docs": "/docs",
        "layers": [
            "presentation",
            "api-gateway",
            "microservices",
            "ai-ml",
            "database",
        ],
    }


@app.get("/health")
def health():
    from app.ml.inference import status as ml_status

    return {"status": "healthy", "ml": ml_status()}
