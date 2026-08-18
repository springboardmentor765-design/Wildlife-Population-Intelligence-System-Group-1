from pathlib import Path

from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"
IMAGE_UPLOAD_DIR = UPLOAD_DIR / "images"
AUDIO_UPLOAD_DIR = UPLOAD_DIR / "audio"
AVATAR_UPLOAD_DIR = UPLOAD_DIR / "avatars"
ML_MODELS_DIR = BASE_DIR / "ml_models"
IMAGE_MODEL_DIR = ML_MODELS_DIR / "image"
AUDIO_MODEL_DIR = ML_MODELS_DIR / "audio"

ALL_ROLES = (
    "researcher",
    "conservation_officer",
    "forest_department",
    "administrator",
)

ROLE_LABELS = {
    "researcher": "Wildlife Researcher",
    "conservation_officer": "Conservation Officer",
    "forest_department": "Forest Department",
    "administrator": "Administrator",
}


class Settings(BaseSettings):
    SECRET_KEY: str = "wildlife-intelligence-dev-secret-change-me"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 720
    DATABASE_URL: str = f"sqlite:///{(BASE_DIR / 'wildlife.db').as_posix()}"
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"
    MAX_IMAGE_SIZE_MB: int = 15
    MAX_AUDIO_SIZE_MB: int = 30
    MAX_AVATAR_SIZE_MB: int = 5
    IMAGE_MODEL_PATH: str = ""
    AUDIO_MODEL_PATH: str = ""
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""

    class Config:
        env_file = BASE_DIR / ".env"
        extra = "ignore"

    @property
    def origins(self) -> list[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]


settings = Settings()
IMAGE_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
AUDIO_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
AVATAR_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
IMAGE_MODEL_DIR.mkdir(parents=True, exist_ok=True)
AUDIO_MODEL_DIR.mkdir(parents=True, exist_ok=True)
