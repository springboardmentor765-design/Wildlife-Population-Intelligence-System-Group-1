"""Google Identity Services ID-token verification."""
from __future__ import annotations

import secrets
from urllib.request import Request, urlopen

from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app import models
from app.config import ALL_ROLES, AVATAR_UPLOAD_DIR, settings
from app.security import hash_password


def google_configured() -> bool:
    return bool(settings.GOOGLE_CLIENT_ID.strip())


def verify_google_credential(credential: str) -> dict:
    if not google_configured():
        raise HTTPException(status_code=503, detail="Google sign-in is not configured")
    try:
        from google.auth.transport import requests as google_requests
        from google.oauth2 import id_token
    except ImportError as exc:
        raise HTTPException(
            status_code=503,
            detail="Install google-auth in the backend venv: pip install google-auth",
        ) from exc
    try:
        info = id_token.verify_oauth2_token(
            credential,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID.strip(),
            clock_skew_in_seconds=10,
        )
    except Exception as exc:
        raise HTTPException(status_code=401, detail="Google sign-in could not be verified") from exc
    if info.get("iss") not in {"accounts.google.com", "https://accounts.google.com"}:
        raise HTTPException(status_code=401, detail="Invalid Google issuer")
    if not info.get("email"):
        raise HTTPException(status_code=401, detail="Google did not return an email")
    if info.get("email_verified") is False:
        raise HTTPException(status_code=401, detail="Google email is not verified")
    return info


def _save_google_photo(user_id: int, url: str) -> str | None:
    if not url:
        return None
    try:
        req = Request(url, headers={"User-Agent": "WildlifeIntelligence/1.0"})
        with urlopen(req, timeout=8) as resp:
            data = resp.read(2_000_000)
        if not data:
            return None
        dest = AVATAR_UPLOAD_DIR / f"{user_id}_google.jpg"
        dest.write_bytes(data)
        return f"uploads/avatars/{dest.name}"
    except Exception:
        return None


def upsert_google_user(db: Session, info: dict, requested_role: str) -> models.User:
    email = str(info["email"]).strip().lower()
    sub = str(info.get("sub") or "")
    name = (info.get("name") or email.split("@")[0]).strip()[:150]
    picture = str(info.get("picture") or "")
    role = requested_role if requested_role in ALL_ROLES else "researcher"

    user = None
    if sub:
        user = db.query(models.User).filter(models.User.google_sub == sub).first()
    if not user:
        user = db.query(models.User).filter(func.lower(models.User.email) == email).first()

    if user:
        if sub and not user.google_sub:
            user.google_sub = sub
        if not user.avatar_path and picture:
            saved = _save_google_photo(user.user_id, picture)
            if saved:
                user.avatar_path = saved
        db.commit()
        db.refresh(user)
        return user

    user = models.User(
        name=name,
        email=email,
        password=hash_password(secrets.token_urlsafe(32)),
        role=role,
        auth_provider="google",
        google_sub=sub or None,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    if picture:
        saved = _save_google_photo(user.user_id, picture)
        if saved:
            user.avatar_path = saved
            db.commit()
            db.refresh(user)
    return user
