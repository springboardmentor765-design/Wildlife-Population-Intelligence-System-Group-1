# Wildlife Population Intelligence System Backend

FastAPI + PostgreSQL backend for the Wildlife Population Intelligence System.

1. Create database `wildlife_population_intelligence_system` in PostgreSQL 17.
2. With Python 3.11+, run `pip install -e .` inside `backend/`.
3. Copy `.env.example` to `.env`, then set `DATABASE_URL` and a secure `SECRET_KEY`.
4. Run `alembic upgrade head`.
5. Seed development data: `PYTHONPATH=. python -m app.seed`.
6. Start: `uvicorn app.main:app --reload`.

Swagger: http://localhost:8000/docs · ReDoc: http://localhost:8000/redoc · Health: http://localhost:8000/health.

The API covers authentication, species, population observations, image/audio uploads (explicit deterministic demo inference until trained models are supplied), dashboard analytics, CSV reports, users, and profile settings. Start the Next.js app in `frontend/` with `npm run dev`.
