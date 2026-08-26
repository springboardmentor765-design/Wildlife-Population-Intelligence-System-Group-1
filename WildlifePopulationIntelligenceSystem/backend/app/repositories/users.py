from sqlalchemy import Select, or_, select
from sqlalchemy.orm import Session
from app.models.user import User


class UserRepository:
    def get(self, db: Session, user_id: int) -> User | None: return db.get(User, user_id)
    def by_email(self, db: Session, email: str) -> User | None: return db.scalar(select(User).where(User.email == email.lower()))
    def list(self, db: Session, search: str | None, role: str | None, active: bool | None, skip: int, limit: int) -> list[User]:
        query: Select = select(User)
        if search:
            term = f"%{search}%"; query = query.where(or_(User.name.ilike(term), User.email.ilike(term)))
        if role: query = query.where(User.role == role)
        if active is not None: query = query.where(User.is_active == active)
        return list(db.scalars(query.order_by(User.created_at.desc()).offset(skip).limit(limit)))
    def save(self, db: Session, user: User) -> User: db.add(user); db.commit(); db.refresh(user); return user
    def delete(self, db: Session, user: User) -> None: db.delete(user); db.commit()
