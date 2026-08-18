from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.orm import Session
from app.core.security import hash_password
from app.database.session import get_db
from app.dependencies.auth import require_roles
from app.models.user import User
from app.repositories.users import UserRepository
from app.schemas.user import UserCreate, UserResponse, UserUpdate
from app.services.auth_service import AuthService, VALID_ROLES

router = APIRouter(prefix="/users", tags=["users"]); repo = UserRepository()
def admin(user: User = Depends(require_roles("admin"))) -> User: return user
@router.get("", response_model=list[UserResponse])
def list_users(search: str | None = None, role: str | None = None, is_active: bool | None = None, skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=100), db: Session = Depends(get_db), _: User = Depends(admin)): return repo.list(db, search, role, is_active, skip, limit)
@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db), _: User = Depends(admin)):
    user = repo.get(db, user_id)
    if not user: from fastapi import HTTPException; raise HTTPException(404, "User not found")
    return user
@router.post("", response_model=UserResponse, status_code=201)
def create_user(data: UserCreate, db: Session = Depends(get_db), _: User = Depends(admin)): return AuthService().register(db, data)
@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, data: UserUpdate, db: Session = Depends(get_db), _: User = Depends(admin)):
    user = repo.get(db, user_id)
    if not user: from fastapi import HTTPException; raise HTTPException(404, "User not found")
    changes = data.model_dump(exclude_unset=True)
    if changes.get("role") and changes["role"] not in VALID_ROLES: from fastapi import HTTPException; raise HTTPException(422, "Invalid role")
    if "password" in changes: user.password_hash = hash_password(changes.pop("password"))
    for field, value in changes.items(): setattr(user, field, value)
    return repo.save(db, user)
@router.delete("/{user_id}", status_code=204)
def delete_user(user_id: int, db: Session = Depends(get_db), _: User = Depends(admin)):
    user = repo.get(db, user_id)
    if not user: from fastapi import HTTPException; raise HTTPException(404, "User not found")
    repo.delete(db, user); return Response(status_code=204)
