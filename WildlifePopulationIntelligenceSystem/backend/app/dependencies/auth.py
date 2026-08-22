from collections.abc import Callable
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from app.core.config import get_settings
from app.database.session import get_db
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    try: subject = jwt.decode(token, get_settings().secret_key, algorithms=[get_settings().jwt_algorithm]).get("sub")
    except JWTError as error: raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid authentication credentials") from error
    user = db.get(User, int(subject)) if subject and str(subject).isdigit() else None
    if not user or not user.is_active: raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid authentication credentials")
    return user

def require_roles(*roles: str) -> Callable:
    def dependency(user: User = Depends(get_current_user)) -> User:
        # Older accounts use ``administrator`` while the current API uses ``admin``.
        # Treat both spellings as the same administrative role so existing users
        # retain their access after the role names were standardised.
        role = "admin" if user.role == "administrator" else user.role
        if role not in roles: raise HTTPException(status.HTTP_403_FORBIDDEN, "You do not have permission for this action")
        return user
    return dependency
