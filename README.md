# Wildlife Population Intelligence System

Dark forest-themed conservation platform. The landing page matches the Wildlife Intelligence mockup (sidebar + jungle login). The backend follows the architecture diagram as a **modular FastAPI gateway** with service routers, an AI/ML inference layer, and the five core tables.

## Stack

| Architecture layer | What we built |
| --- | --- |
| Presentation | React 19, Vite, Tailwind — web app, dashboards, GIS map, reports |
| API Gateway | FastAPI — routing, JWT auth, CORS, validation, request logging |
| Microservices | User & Access, Survey, Image/Audio ingestion & analysis, Species, Population, Biodiversity, Habitat, Conservation, Health, Alerts, Reports |
| AI / ML | `backend/app/ml/` loads **your** image and voice weights from `backend/ml_models/` |
| Database | SQLite by default (`backend/wildlife.db`). PostgreSQL via `DATABASE_URL` + `backend/sql/schema.sql` |

## Where to put your trained models

```
WLP/backend/ml_models/
  image/     ← image / YOLOv8 / vision weights
  audio/     ← voice / bioacoustic weights
```

**Image model** — copy the file into `backend/ml_models/image/` using one of these names:

- `best.pt` (Ultralytics YOLOv8 — recommended)
- `wildlife_image.pt`, `yolov8.pt`, `model.pt`, `model.onnx`, `model.keras`, `model.h5`

Then edit `backend/ml_models/image/labels.json` so class indexes match `Species.common_name`.

**Voice / audio model** — copy the file into `backend/ml_models/audio/`:

- `wildlife_voice.pt`, `best.pt`, `model.keras`, `model.h5`, `yamnet.tflite`, `model.onnx`

Then edit `backend/ml_models/audio/labels.json`.

After dropping the files in:

```bash
cd backend
pip install -r requirements-ml.txt
```

Restart the API. Image Analysis and Audio Analysis will show **Trained model loaded**. If no weight file is present, the app still runs with demo inference.

## Database schema

**Users** — `user_id` PK, name, email, password (bcrypt), role, created_at  
**Species** — `species_id` PK, common_name, scientific_name, species_group, iucn_status  
**Images** — `image_id` PK, user_id FK, image_path, uploaded_at, species_id FK, animal_count, confidence  
**Audio** — `audio_id` PK, user_id FK, audio_path, uploaded_at, species_id FK, confidence, duration  
**Population** — `population_id` PK, species_id FK, image_id FK nullable, audio_id FK nullable, population_count, observation_date  

Roles: `researcher`, `conservation_officer`, `forest_department`, `administrator`.

Surveys and alerts are extra tables so the sidebar modules have real data.

## Run locally

Needs Python 3.11+ and Node 20+.

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python -m app.seed
uvicorn app.main:app --reload --port 8000
```

API docs: http://127.0.0.1:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:5173

### Demo login (password for all: `password123`)

| Role | Email |
| --- | --- |
| Researcher | researcher@wildlife.com |
| Conservation Officer | officer@wildlife.com |
| Forest Department | forest@wildlife.com |
| Administrator | admin@wildlife.com |

Or use **Quick Login** on the landing page, or **Continue with Google**.

To enable Google Sign-In, create an OAuth **Web client** in [Google Cloud Console](https://console.cloud.google.com/apis/credentials), then put the client ID in `backend/.env`:

```
GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com
```

Authorized JavaScript origins:

- `http://localhost:5173`
- `http://127.0.0.1:5173`

Restart the API after saving `.env`. New Google accounts default to Wildlife Researcher (or the role chosen on Sign Up). The Google profile photo is used as the avatar when the account is created.

## Project layout

```
WLP/
  frontend/                      Presentation layer (landing page + dashboards)
  backend/
    app/main.py                  API gateway
    app/models.py                Users, Species, Images, Audio, Population
    app/routers/                 Microservice HTTP surfaces
    app/services/                Biodiversity, habitat, population, health
    app/ml/                      Inference (vision + bioacoustic)
    ml_models/image/             <<< put image model here
    ml_models/audio/             <<< put voice model here
    sql/schema.sql               PostgreSQL schema
    uploads/                     Ingested images and audio
  docker-compose.yml
```

## Docker

```bash
docker compose up --build
```
