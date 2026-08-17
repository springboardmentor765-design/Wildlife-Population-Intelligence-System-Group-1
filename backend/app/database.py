from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker, declarative_base

from app.config import settings

connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def ensure_columns() -> None:
    """Add columns that create_all will not apply on an existing SQLite file."""
    inspector = inspect(engine)
    if "users" not in inspector.get_table_names():
        return
    cols = {c["name"] for c in inspector.get_columns("users")}
    statements = []
    if "avatar_path" not in cols:
        statements.append("ALTER TABLE users ADD COLUMN avatar_path VARCHAR(500)")
    if "auth_provider" not in cols:
        statements.append("ALTER TABLE users ADD COLUMN auth_provider VARCHAR(30) DEFAULT 'local'")
    if "google_sub" not in cols:
        statements.append("ALTER TABLE users ADD COLUMN google_sub VARCHAR(128)")
    if statements:
        with engine.begin() as conn:
            for sql in statements:
                conn.execute(text(sql))


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
