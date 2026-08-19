#  Wildlife Population Intelligence System — Backend

<p align="center">
  <strong>FastAPI-powered backend for wildlife detection, population intelligence, analytics, authentication, and conservation data management.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"/>
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/SQLAlchemy-ORM-D71F00?style=for-the-badge" alt="SQLAlchemy"/>
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/Alembic-Migrations-499848?style=for-the-badge" alt="Alembic"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
</p>

---

##  Overview

The backend of the **Wildlife Population Intelligence System** provides the core API and intelligence infrastructure for the platform.

It is built with **FastAPI** and follows a modular service-oriented architecture to handle:

*  Authentication and authorization
*  Wildlife image processing
*  Wildlife video processing
*  Bioacoustic analysis
*  Species detection and classification
*  Population and biodiversity analytics
*  Wildlife alerts and anomaly detection
*  GPS and habitat-related metadata
*  Database persistence
*  Result and report management
*  AI/ML model integration

The backend exposes REST APIs consumed by the **Next.js frontend**.

---

# Backend Architecture

```text
                         ┌─────────────────────────────┐
                         │        Next.js Frontend     │
                         │ Dashboard • Maps • Reports  │
                         └──────────────┬──────────────┘
                                        │
                                  REST API / HTTPS
                                        │
                                        ▼
                  ┌─────────────────────────────────────────┐
                  │             FastAPI Backend             │
                  │                                         │
                  │ Authentication • API • Business Logic   │
                  └───────────────┬─────────────┬───────────┘
                                  │             │
                       ┌──────────▼──────┐ ┌────▼──────────────┐
                       │   API Layer     │ │  Service Layer    │
                       │                │ │                    │
                       │ Routes         │ │ AI / ML Logic      │
                       │ Validation     │ │ Detection          │
                       │ Requests       │ │ Analytics          │
                       │ Responses      │ │ Processing         │
                       └────────┬───────┘ └─────────┬─────────┘
                                │                   │
                                └─────────┬─────────┘
                                          │
                         ┌────────────────▼────────────────┐
                         │          Data Layer             │
                         │                                 │
                         │ SQLAlchemy • Models • Schemas   │
                         │ Database • Migrations           │
                         └────────────────┬────────────────┘
                                          │
                                          ▼
                              ┌──────────────────────┐
                              │    Neon PostgreSQL   │
                              │                      │
                              │ Users • Species      │
                              │ Detections • Alerts  │
                              │ Analytics • Metadata │
                              └──────────────────────┘
```

---

# 📂 Backend Structure

The current backend follows a modular structure:

```text
wildlife-backend/
│
├── __pycache__/
│
├── alembic/
│   └── Database migration files
│
├── api/
│   └── API routes and endpoint modules
│
├── database/
│   └── Database configuration and connection
│
├── models/
│   └── SQLAlchemy database models
│
├── schemas/
│   └── Pydantic request/response schemas
│
├── services/
│   └── Business logic and AI/ML services
│
├── results/
│   └── Generated detection and processing results
│
├── uploads/
│   └── Uploaded wildlife media
│
├── utils/
│   └── Shared utilities and helper functions
│
├── .gitignore
├── Dockerfile
├── alembic.ini
├── main.py
├── requirements.txt
│
└── README.md
```

---

# 🧩 Core Components

## 1. `api/`

The `api` package contains the backend's HTTP API layer.

Responsibilities include:

* Defining REST endpoints
* Receiving frontend requests
* Validating request data
* Calling service-layer functions
* Returning structured API responses
* Handling authentication dependencies

Conceptually:

```text
Frontend Request
       │
       ▼
     API
       │
       ▼
   Validation
       │
       ▼
   Service Layer
       │
       ▼
   Database / AI
       │
       ▼
   API Response
```

---

# 🗄️ 2. `database/`

The `database` package manages database connectivity and persistence configuration.

The application is designed around **PostgreSQL**, with **Neon PostgreSQL** serving as the cloud database layer.

Typical responsibilities:

* Database engine configuration
* Session management
* SQLAlchemy Base
* Database connection lifecycle
* Transaction handling

Example conceptual flow:

```text
FastAPI
   │
   ▼
SQLAlchemy Session
   │
   ▼
PostgreSQL Driver
   │
   ▼
Neon PostgreSQL
```

---

# 🧱 3. `models/`

The `models` package defines database entities using SQLAlchemy ORM.

Potential entities include:

```text
User
Species
Detection
Population
Habitat
Alert
AudioAnalysis
ImageAnalysis
Report
```

Models provide the persistence layer between the application and PostgreSQL.

---

# 📋 4. `schemas/`

The `schemas` package contains **Pydantic models** used for API validation and serialization.

Schemas separate external API data from internal database models.

Example:

```text
HTTP Request
     │
     ▼
Pydantic Schema
     │
     ▼
Validation
     │
     ▼
Service
     │
     ▼
SQLAlchemy Model
```

This helps maintain:

* Type safety
* Request validation
* Response consistency
* API documentation

---

# 🤖 5. `services/`

The `services` directory contains the primary business logic of the application.

This layer can handle:

* Wildlife detection
* AI/ML inference
* Image processing
* Video processing
* Audio processing
* Population analytics
* Biodiversity calculations
* Alert generation
* Report generation
* Data processing

The service layer keeps complex business logic outside API route handlers.

### Recommended architecture

```text
API Route
   │
   ▼
Service
   │
   ├── AI/ML Processing
   ├── Analytics
   ├── Database
   └── File Processing
```

---

# 📷 6. `uploads/`

The `uploads` directory is used for uploaded wildlife media.

Supported data may include:

```text
Images
Videos
Audio
```

Example:

```text
uploads/
└── videos/
    ├── wildlife_001.mp4
    ├── wildlife_002.mp4
    └── ...
```

> Production deployments should preferably use object storage rather than relying on local container storage.

---

# 📊 7. `results/`

The `results` directory contains generated processing outputs.

For example:

```text
results/
└── videos/
    ├── detection_001/
    ├── detection_002/
    └── ...
```

Generated results may contain:

* Detection metadata
* Processed media
* AI predictions
* Confidence scores
* Analysis results

---

# 🛠️ 8. `utils/`

The `utils` package contains reusable helper functionality.

Typical responsibilities include:

* File validation
* Authentication helpers
* Token utilities
* Data transformation
* Common constants
* Logging helpers
* Validation utilities

---

# 🔄 9. `alembic/`

**Alembic** is used for database schema migrations.

Migration workflow:

```text
SQLAlchemy Model
       │
       ▼
Alembic Migration
       │
       ▼
Migration Execution
       │
       ▼
Neon PostgreSQL
```

Create a migration:

```bash
alembic revision --autogenerate -m "describe migration"
```

Apply migrations:

```bash
alembic upgrade head
```

Check migration status:

```bash
alembic current
```

View migration history:

```bash
alembic history
```

---

# 🚀 Application Entry Point

The main FastAPI application starts from:

```text
main.py
```

Typical startup command:

```bash
uvicorn main:app --reload
```

The development server will be available at:

```text
http://localhost:8000
```

---

# 📡 API Documentation

FastAPI automatically provides interactive API documentation.

### Swagger UI

```text
http://localhost:8000/docs
```

### ReDoc

```text
http://localhost:8000/redoc
```

### OpenAPI Schema

```text
http://localhost:8000/openapi.json
```

Swagger UI can be used to:

* Inspect endpoints
* Test requests
* View request schemas
* View response schemas
* Test authentication
* Debug API integration

---

# 🔐 Authentication

The backend uses token-based authentication for protected resources.

Conceptual flow:

```text
User Login
    │
    ▼
Authentication API
    │
    ▼
Credential Validation
    │
    ▼
JWT Generation
    │
    ▼
Frontend
    │
    ▼
Bearer Token
    │
    ▼
Protected API
```

Authenticated requests use:

```http
Authorization: Bearer <ACCESS_TOKEN>
```

---

# 👥 Authorization Roles

The platform supports role-oriented access.

```text
Researcher
    │
    ├── Wildlife Analysis
    ├── Population Analytics
    └── Research Reports


Conservation Officer
    │
    ├── Population Monitoring
    ├── Threat Analysis
    └── Conservation Insights


Administrator
    │
    ├── User Management
    ├── System Management
    └── Administrative Operations
```

Authorization should be enforced at the API/service layer rather than relying only on frontend restrictions.

---

# 🤖 AI/ML Processing

The backend is designed to integrate AI/ML processing into the wildlife intelligence pipeline.

```text
Wildlife Media
      │
      ▼
Preprocessing
      │
      ▼
AI / ML Engine
      │
      ├── YOLO Detection
      ├── Species Classification
      ├── Sound Analysis
      ├── Anomaly Detection
      └── Forecasting
      │
      ▼
Prediction Results
      │
      ▼
Intelligence Layer
      │
      ▼
Database
```

---

# 🐾 Wildlife Detection

A typical image-analysis workflow is:

```text
Image Upload
     │
     ▼
File Validation
     │
     ▼
Image Preprocessing
     │
     ▼
YOLO Inference
     │
     ▼
Species Detection
     │
     ├── Species
     ├── Bounding Box
     └── Confidence
     │
     ▼
Result Processing
     │
     ▼
Database
     │
     ▼
Frontend Dashboard
```

---

# 🎥 Video Processing

The backend can process wildlife video inputs through a dedicated processing pipeline.

```text
Video Upload
     │
     ▼
Video Validation
     │
     ▼
Frame Extraction
     │
     ▼
AI Detection
     │
     ▼
Frame-Level Results
     │
     ▼
Detection Aggregation
     │
     ▼
Video Intelligence
```

---

# 🎙️ Bioacoustic Processing

Audio data can be processed through an extensible audio intelligence pipeline.

```text
Audio Upload
     │
     ▼
Audio Validation
     │
     ▼
Feature Extraction
     │
     ▼
Sound Classification
     │
     ▼
Species Prediction
     │
     ▼
Confidence Score
     │
     ▼
Database / Analytics
```

---

# 📈 Population Intelligence

Raw detections can be transformed into population-level insights.

```text
Individual Detections
        │
        ▼
Detection Aggregation
        │
        ▼
Species Statistics
        │
        ▼
Historical Comparison
        │
        ▼
Population Trends
        │
        ▼
Forecasting / Intelligence
```

Possible metrics include:

* Species count
* Detection frequency
* Population trends
* Population growth/decline
* Species distribution
* Biodiversity indicators
* Detection confidence
* Habitat relationships

---

# 🚨 Alert & Anomaly Intelligence

The backend can support automated wildlife alerts.

Example flow:

```text
New Detection
      │
      ▼
Anomaly Analysis
      │
      ├── Unusual Population Change
      ├── Rare Species Detection
      ├── Unusual Activity
      └── Threat Indicator
      │
      ▼
Alert Generation
      │
      ▼
Conservation Dashboard
```

---

# 🗃️ Database Architecture

The backend uses **PostgreSQL through Neon** for persistent application data.

Conceptually:

```text
                    Neon PostgreSQL
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
      Users             Wildlife           Analytics
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
           Species      Detections    Population
              │            │            │
              └────────────┼────────────┘
                           │
                           ▼
                       Reports
```

Large binary media such as videos, images, and audio should be handled through appropriate file/object storage rather than storing raw media directly inside relational database tables.

---

# ⚙️ Environment Configuration

Create a local `.env` file for development.

Example:

```env
DATABASE_URL=postgresql://<user>:<password>@<host>/<database>

SECRET_KEY=your-secret-key

JWT_SECRET_KEY=your-jwt-secret

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=30
```

> Never commit `.env` files or production credentials to GitHub.

---

# 🛠️ Local Development

## 1. Clone the Repository

```bash
git clone https://github.com/yourusername/Wildlife-Population-Intelligence-System-Group-1.git
```

Navigate to the backend:

```bash
cd Wildlife-Population-Intelligence-System-Group-1/backend/wildlife-backend
```

---

## 2. Create Virtual Environment

### Windows

```bash
python -m venv venv
```

Activate:

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

---

## 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 4. Configure Environment Variables

Create:

```text
.env
```

Add the required database and authentication configuration.

---

## 5. Run Database Migrations

```bash
alembic upgrade head
```

---

## 6. Start the API

```bash
uvicorn main:app --reload
```

The API will start at:

```text
http://localhost:8000
```

---

# 🐳 Docker

The backend includes a `Dockerfile` for containerized execution.

Build the image:

```bash
docker build -t wildlife-backend .
```

Run the container:

```bash
docker run -p 8000:8000 wildlife-backend
```

For the complete application stack, use the root-level Docker Compose configuration.

---

# 🧪 Testing

Run backend tests with:

```bash
pytest
```

Verbose mode:

```bash
pytest -v
```

Run a specific test:

```bash
pytest test_alerts.py
```

---

# 🔍 Code Quality

Recommended development checks:

```bash
python -m compileall .
```

Check installed dependencies:

```bash
pip list
```

For production development, consider integrating:

* Ruff
* Black
* MyPy
* Pytest
* Pre-commit

---

# 🔒 Security Best Practices

Before production deployment:

* Never expose `.env` files
* Use strong JWT secrets
* Validate uploaded files
* Restrict upload size
* Validate MIME types
* Sanitize filenames
* Implement authentication on protected endpoints
* Enforce role-based authorization
* Configure CORS securely
* Use HTTPS
* Add API rate limiting
* Avoid storing sensitive credentials in source code
* Keep dependencies updated
* Use secure database credentials

---

# 📦 Dependency Management

Backend dependencies are maintained in:

```text
requirements.txt
```

Install all dependencies:

```bash
pip install -r requirements.txt
```

Generate an updated dependency list when required:

```bash
pip freeze > requirements.txt
```

> In a production workflow, dependency versions should ideally be reviewed and pinned deliberately rather than blindly freezing every local package.

---

# 🌐 Frontend Integration

The Next.js frontend communicates with this backend through REST APIs.

```text
┌──────────────────────┐
│    Next.js Frontend  │
│                      │
│ Dashboard            │
│ Maps                 │
│ Reports              │
│ Analytics            │
└──────────┬───────────┘
           │
           │ HTTP / REST
           ▼
┌──────────────────────┐
│    FastAPI Backend   │
│                      │
│ Authentication       │
│ Wildlife API         │
│ Analytics API        │
│ Detection API        │
│ Report API           │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Neon PostgreSQL    │
└──────────────────────┘
```

---

# 📋 Development Workflow

Recommended development flow:

```text
Create Feature Branch
        │
        ▼
Implement Feature
        │
        ▼
Run Tests
        │
        ▼
Run API Locally
        │
        ▼
Verify Database
        │
        ▼
Commit Changes
        │
        ▼
Push Branch
        │
        ▼
Open Pull Request
```

Example:

```bash
git checkout -b feature/wildlife-detection
```

```bash
git add .
git commit -m "Add wildlife detection service"
```

```bash
git push origin feature/wildlife-detection
```

---

# 🧭 Backend Development Principles

The backend follows these architectural principles:

### Separation of Concerns

API routes should remain lightweight while business logic belongs in services.

### Reusable Services

AI, analytics, and processing logic should be reusable across multiple endpoints.

### Schema Validation

Pydantic schemas should validate external API data.

### ORM-Based Persistence

SQLAlchemy models provide structured database access.

### Database Versioning

Alembic manages schema evolution.

### Secure Configuration

Secrets and environment-specific configuration belong in environment variables.

### API-First Design

The backend should expose predictable, documented REST interfaces for frontend and future client integrations.

---

# 🚀 Production Architecture

A production deployment can evolve toward:

```text
                         Internet
                            │
                            ▼
                     Reverse Proxy
                            │
                    HTTPS / SSL
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
       Next.js Frontend            FastAPI Backend
                                          │
                         ┌────────────────┼────────────────┐
                         │                │                │
                         ▼                ▼                ▼
                  Neon PostgreSQL     AI/ML Engine    Object Storage
                         │                                 │
                         │                        Images / Videos
                         │                        Audio / Reports
                         │
                         ▼
                 Intelligence Data
```

---

# 🗺️ Future Backend Roadmap

* [ ] Production-grade bioacoustic classification
* [ ] Real-time wildlife detection
* [ ] Advanced video tracking
* [ ] Multi-object tracking
* [ ] Wildlife re-identification
* [ ] Population forecasting models
* [ ] Geospatial intelligence
* [ ] GIS integration
* [ ] Satellite imagery processing
* [ ] Real-time conservation alerts
* [ ] Background task processing
* [ ] Distributed AI inference
* [ ] Cloud object storage
* [ ] Redis caching
* [ ] API rate limiting
* [ ] CI/CD automation
* [ ] Production observability
* [ ] Horizontal API scaling

---

# 📚 Related Documentation

| Documentation                        | Description                     |
| ------------------------------------ | ------------------------------- |
| `README.md`                          | Complete project documentation  |
| `backend/wildlife-backend/README.md` | Backend-specific documentation  |
| `alembic/`                           | Database migration history      |
| `requirements.txt`                   | Python dependencies             |
| `Dockerfile`                         | Backend container configuration |

---

# 👨‍💻 Backend Technology Summary

```text
                    ECO VISION AI
                         │
                         ▼
                    FastAPI API
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
      SQLAlchemy       AI / ML       Services
          │              │              │
          ▼              ▼              ▼
   Neon PostgreSQL    YOLO / CV     Analytics
          │              │              │
          └──────────────┼──────────────┘
                         ▼
                 Wildlife Intelligence
```

---

# 🌍 Mission

The backend is the intelligence and data-processing core of **ECO VISION AI**.

Its objective is to provide a scalable foundation for transforming wildlife observations into structured intelligence that can support:

* Wildlife researchers
* Conservation officers
* Forest departments
* Ecological organizations
* Biodiversity monitoring teams

> **Observe. Analyze. Predict. Protect. 🦁🌿**
