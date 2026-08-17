from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas
from app.deps import get_current_user, require_roles
from app.config import ALL_ROLES

router = APIRouter(prefix="/users", tags=["User & Access Service"])


@router.get("", response_model=List[schemas.UserOut])
def list_users(
    db: Session = Depends(get_db),
    _: models.User = Depends(require_roles("administrator")),
):
    return db.query(models.User).order_by(models.User.created_at.desc()).all()


@router.patch("/{user_id}", response_model=schemas.UserOut)
def update_user(
    user_id: int,
    payload: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current: models.User = Depends(require_roles("administrator")),
):
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if payload.role:
        if payload.role not in ALL_ROLES:
            raise HTTPException(status_code=400, detail="Invalid role")
        if user.role == "administrator" and payload.role != "administrator":
            admins = db.query(models.User).filter(models.User.role == "administrator").count()
            if admins <= 1:
                raise HTTPException(status_code=400, detail="Keep at least one administrator")
        user.role = payload.role
    if payload.name:
        user.name = payload.name.strip()
    db.commit()
    db.refresh(user)
    return user


@router.get("/{user_id}", response_model=schemas.UserOut)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current: models.User = Depends(get_current_user),
):
    if current.role != "administrator" and current.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not allowed")
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
