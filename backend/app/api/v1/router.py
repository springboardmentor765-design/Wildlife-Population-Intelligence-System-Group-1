from fastapi import APIRouter
from app.api.v1.analytics.router import router as analytics_router
from app.api.v1.audio.router import router as audio_router
from app.api.v1.auth.router import router as auth_router
from app.api.v1.images.router import router as images_router
from app.api.v1.population.router import router as population_router
from app.api.v1.reports.router import router as reports_router
from app.api.v1.settings.router import router as settings_router
from app.api.v1.species.router import router as species_router
from app.api.v1.users.router import router as users_router

api_router = APIRouter(prefix="/api/v1")
for module_router in (auth_router, users_router, species_router, population_router, images_router, audio_router, analytics_router, reports_router, settings_router):
    api_router.include_router(module_router)
