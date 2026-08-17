from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from pathlib import Path
import uuid

from app.database import get_db
from app import models, schemas
from app.security import hash_password, verify_password, create_access_token
from app.deps import get_current_user
from app.config import ALL_ROLES, AVATAR_UPLOAD_DIR, BASE_DIR, settings
from app.google_oauth import google_configured, upsert_google_user, verify_google_credential

router = APIRouter(prefix="/auth", tags=["User & Access Service"])

ALLOWED_AVATARS = {"image/jpeg", "image/png", "image/webp", "image/jpg", "image/gif"}


def _issue_token(user: models.User) -> schemas.Token:
    token = create_access_token({"sub": str(user.user_id), "role": user.role})
    return schemas.Token(access_token=token, user=schemas.UserOut.model_validate(user))


def _remove_avatar_file(relative_path: str | None) -> None:
    if not relative_path:
        return
    full = (BASE_DIR / relative_path).resolve()
    avatars = AVATAR_UPLOAD_DIR.resolve()
    if avatars in full.parents and full.is_file():
        full.unlink()


@router.post("/register", response_model=schemas.Token, status_code=status.HTTP_201_CREATED)
def register(payload: schemas.UserCreate, db: Session = Depends(get_db)):
    if payload.role not in ALL_ROLES:
        raise HTTPException(status_code=400, detail=f"role must be one of {list(ALL_ROLES)}")

    existing = db.query(models.User).filter(models.User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists")

    user = models.User(
        name=payload.name,
        email=payload.email,
        password=hash_password(payload.password),
        role=payload.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return _issue_token(user)


@router.post("/login", response_model=schemas.Token)
def login(payload: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if user and getattr(user, "auth_provider", "local") == "google":
        raise HTTPException(status_code=401, detail="This account uses Google Sign-In")
    if not user or not verify_password(payload.password, user.password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    return _issue_token(user)


@router.get("/google/config")
def google_config():
    return {
        "enabled": google_configured(),
        "client_id": settings.GOOGLE_CLIENT_ID.strip() if google_configured() else "",
    }


@router.post("/google", response_model=schemas.Token)
def google_login(payload: schemas.GoogleLoginRequest, db: Session = Depends(get_db)):
    info = verify_google_credential(payload.credential)
    user = upsert_google_user(db, info, payload.role)
    return _issue_token(user)


@router.post("/quick-login/{role}", response_model=schemas.Token)
def quick_login(role: str, db: Session = Depends(get_db)):
    if role not in ALL_ROLES:
        raise HTTPException(status_code=400, detail=f"role must be one of {list(ALL_ROLES)}")
    user = db.query(models.User).filter(models.User.role == role).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail=f"No demo user seeded for role '{role}'. Run: python -m app.seed",
        )
    return _issue_token(user)


@router.get("/me", response_model=schemas.UserOut)
def read_current_user(current_user: models.User = Depends(get_current_user)):
    return current_user


@router.post("/me/avatar", response_model=schemas.UserOut)
async def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    content_type = (file.content_type or "").lower()
    if content_type not in ALLOWED_AVATARS and not content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Use a JPEG, PNG, WEBP, or GIF photo")

    contents = await file.read()
    if len(contents) / (1024 * 1024) > settings.MAX_AVATAR_SIZE_MB:
        raise HTTPException(status_code=400, detail=f"Photo exceeds {settings.MAX_AVATAR_SIZE_MB}MB")

    ext = Path(file.filename or "avatar.jpg").suffix.lower() or ".jpg"
    if ext not in {".jpg", ".jpeg", ".png", ".webp", ".gif"}:
        ext = ".jpg"
    stored = f"{current_user.user_id}_{uuid.uuid4().hex}{ext}"
    dest = AVATAR_UPLOAD_DIR / stored
    dest.write_bytes(contents)

    user = db.query(models.User).filter(models.User.user_id == current_user.user_id).first()
    _remove_avatar_file(user.avatar_path)
    user.avatar_path = f"uploads/avatars/{stored}"
    db.commit()
    db.refresh(user)
    return user


@router.delete("/me/avatar", response_model=schemas.UserOut)
def remove_avatar(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    user = db.query(models.User).filter(models.User.user_id == current_user.user_id).first()
    _remove_avatar_file(user.avatar_path)
    user.avatar_path = None
    db.commit()
    db.refresh(user)
    return user
