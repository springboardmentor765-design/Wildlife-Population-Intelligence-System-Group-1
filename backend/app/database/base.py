from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


# Alembic imports this module as its metadata source.  Importing models here keeps
# every table registered even when a migration is generated from the CLI.
import app.models  # noqa: E402, F401
