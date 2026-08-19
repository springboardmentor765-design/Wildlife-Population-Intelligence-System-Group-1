# Wildlife Population Intelligence System

An AI-powered full-stack platform for wildlife monitoring using image detection, audio classification, population tracking, analytics, and reports.

## Overview

Wildlife Population Intelligence System helps researchers and conservation teams collect, analyse, and manage wildlife evidence in one place.

Users can upload wildlife images or audio recordings. The system runs trained machine-learning models, stores the results in PostgreSQL, and presents detection data through a web dashboard.

## Main Features

- YOLO-based wildlife image detection
- Multiple-animal detection in a single image
- Bounding boxes, confidence scores, and annotated images
- Keras-based wildlife audio classification
- Mel Spectrogram audio preprocessing with Librosa
- PostgreSQL-backed species, population, and detection records
- Analytics, trends, species summaries, and recent records
- Authentication and role-aware access
- PDF report generation and authenticated downloads
- User management and profile settings

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Backend | FastAPI, Python |
| Database | PostgreSQL, SQLAlchemy, Alembic |
| Image AI | Ultralytics YOLO |
| Audio AI | TensorFlow/Keras, Librosa |
| Authentication | JWT Bearer Tokens |
| Reports | ReportLab |

## Project Structure

```text
WildlifePopulationIntelligenceSystem/
├── backend/
│   ├── app/
│   │   ├── api/v1/            # API routes
│   │   ├── core/              # Configuration and security
│   │   ├── database/          # Database session and base
│   │   ├── models/            # SQLAlchemy models
│   │   ├── repositories/      # Database queries
│   │   ├── schemas/           # Pydantic schemas
│   │   └── services/          # Inference and business logic
│   ├── alembic/               # Database migrations
│   ├── models/                # Trained model files
│   └── uploads/               # Uploaded and annotated files
├── frontend/
│   ├── app/                   # Next.js routes
│   ├── components/            # Reusable UI components
│   └── lib/                   # API client and utilities
└── README.md
```

## Required Model Files

Place the trained models in `backend/models/`:

```text
backend/models/
├── best.pt
├── audio_model_v2_77.keras
└── label_encoder_v2.pkl
```

`best.pt` is used for image detection. `audio_model_v2_77.keras` classifies audio recordings, and `label_encoder_v2.pkl` converts audio model output into species labels. The application reports a clear error when a required model is missing; it does not create fake predictions.

## Prerequisites

- Python 3.11 or newer
- Node.js 18 or newer
- PostgreSQL
- The trained model files listed above

## Backend Setup

Create the database:

```bash
psql -d postgres -c "CREATE DATABASE wildlife_population_intelligence_system;"
```

Install and configure the backend:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Set `backend/.env`:

```env
ENVIRONMENT=development
DATABASE_URL=postgresql+psycopg://YOUR_POSTGRES_USER:YOUR_PASSWORD@localhost:5432/wildlife_population_intelligence_system
SECRET_KEY=replace-with-a-secure-random-secret
ACCESS_TOKEN_EXPIRE_MINUTES=60
CORS_ORIGINS=http://localhost:3000
LOG_LEVEL=INFO
```

Run migrations, seed the initial users, and start the API:

```bash
alembic upgrade head
PYTHONPATH=. python -m app.seed
uvicorn app.main:app --reload
```

Backend URLs:

```text
Health: http://localhost:8000/health
Swagger: http://localhost:8000/docs
ReDoc: http://localhost:8000/redoc
```

## Frontend Setup

In a second terminal:

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Set the frontend API URL in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

Open `http://localhost:3000`.

## Detection Pipelines

### Image Detection

```text
Upload image → Validate → Store original → Run YOLO
→ Read all detections → Generate annotated image
→ Save image detections and population observations
→ Return result to frontend
```

The image result includes species, confidence, animal count, bounding boxes, location, status, and an annotated image URL.

### Audio Detection

```text
Upload recording → Validate → Store recording → Load with Librosa
→ Generate Mel Spectrogram → Run Keras model
→ Decode label → Save audio result to PostgreSQL
→ Return result to frontend
```

## Database Records

The database stores users, species, images, individual image detections, audio recordings, audio results, population observations, and reports. For a multi-animal image, every detected animal is stored separately. For example, Zebra × 2 contributes two Zebra observations, not one image-level count.

## Roles

| Role | Main access |
|---|---|
| Administrator | User management, reports, settings, detections, and analytics |
| Researcher | Detection workflows, species, population, analytics, and reports |
| Field User | Upload evidence and view permitted monitoring data |

## Troubleshooting

If port 8000 is already in use:

```bash
lsof -i :8000
kill -9 PID
uvicorn app.main:app --reload
```

If a model is unavailable, verify the contents of `backend/models/` and restart FastAPI after adding or replacing model files.

If the database connection fails, confirm PostgreSQL is running and check `DATABASE_URL` in `backend/.env`.

## Important Notes

- Detection confidence and labels come from the trained models.
- Dashboard metrics are read from PostgreSQL.
- Model predictions are reviewable evidence and should be validated by wildlife experts.
- Population summaries represent recorded observations, not formal abundance estimates.

## Future Improvements

- Human review and verification queues
- Geospatial and habitat analysis
- Longer-term population trend analysis
- Background inference jobs
- Model version tracking
- Cloud object storage and scheduled reports
- Additional wildlife classes and automated test coverage

## License

This project was developed for academic and internship purposes.
