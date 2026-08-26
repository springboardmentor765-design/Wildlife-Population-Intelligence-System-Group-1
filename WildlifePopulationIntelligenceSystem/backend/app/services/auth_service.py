from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.repositories.users import UserRepository
from app.schemas.user import UserCreate

VALID_ROLES = {"admin", "researcher", "forest_officer"}

class AuthService:
    repo = UserRepository()
    def register(self, db: Session, data: UserCreate) -> User:
        if data.role not in VALID_ROLES: raise HTTPException(422, "role must be admin, researcher, or forest_officer")
        if self.repo.by_email(db, data.email): raise HTTPException(status.HTTP_409_CONFLICT, "An account with this email already exists")
        return self.repo.save(db, User(name=data.name, email=str(data.email).lower(), password_hash=hash_password(data.password), role=data.role))
    def login(self, db: Session, email: str, password: str) -> tuple[str, User]:
        user = self.repo.by_email(db, email)
        if not user or not verify_password(password, user.password_hash): raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Incorrect email or password")
        if not user.is_active: raise HTTPException(status.HTTP_403_FORBIDDEN, "This account is inactive")
        return create_access_token(str(user.id)), user
