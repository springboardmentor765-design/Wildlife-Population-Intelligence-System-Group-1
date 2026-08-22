from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.repositories.users import UserRepository
from app.schemas.user import PasswordChange, UserResponse, UserUpdate
from app.core.security import hash_password, verify_password

router = APIRouter(prefix="/settings", tags=["settings"]); repo = UserRepository()
@router.get("", response_model=UserResponse)
def get_settings(user: User = Depends(get_current_user)): return user
@router.put("", response_model=UserResponse)
def update_settings(data: UserUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    for field, value in data.model_dump(exclude_unset=True, exclude={"password", "role", "is_active"}).items(): setattr(user, field, value)
    return repo.save(db, user)

@router.put("/password", response_model=UserResponse)
def change_password(data: PasswordChange, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if not verify_password(data.current_password, user.password_hash):
        raise HTTPException(400, "Current password is incorrect")
    user.password_hash = hash_password(data.new_password)
    return repo.save(db, user)
