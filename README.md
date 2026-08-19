# Wildlife Population Intelligence System
The Wildlife Population Intelligence System is a collaborative AI/ML and full-stack software project designed to support wildlife monitoring through automated species recognition and structured data management.


The platform accepts wildlife images and audio recordings as input and processes them using trained machine learning models.


For images, the system uses a YOLO-based object detection model capable of identifying multiple animals in a single image. The model provides species predictions, confidence scores, and bounding boxes, which can be used to generate an annotated detection image.


For audio, the system uses a trained deep-learning classification model together with a label encoder to identify wildlife sounds and associate predictions with species labels.


The resulting detection information is stored in PostgreSQL and can be used by the population, analytics, and reporting modules.


The system provides a web-based interface for interacting with these capabilities through a Next.js frontend and FastAPI backend.


---


# Problem Statement


Wildlife monitoring can involve large amounts of images, audio recordings, and observation data. Manually analyzing these resources can be time-consuming and difficult to scale.


The Wildlife Population Intelligence System aims to simplify this process by providing:


- Automated wildlife species detection from images.
- Multiple-animal detection within a single image.
- Wildlife sound classification from audio recordings.
- Confidence-based prediction results.
- Centralized storage of detection information.
- Population observation tracking.
- Analytics based on collected detection data.
- Report generation and monitoring capabilities.


---


# Objectives


The main objectives of the system are:


1. Automate wildlife species recognition from images.
2. Support detection of multiple animals within the same image.
3. Generate bounding boxes and confidence scores for image detections.
4. Classify wildlife sounds from audio recordings.
5. Store detection results in a structured PostgreSQL database.
6. Connect machine learning predictions with population monitoring.
7. Provide analytics based on detection records.
8. Provide reporting capabilities.
9. Provide a centralized web interface for wildlife monitoring.
10. Build a modular architecture that can be extended with improved ML models and additional monitoring features.


---


# Key Features


## 1. Image Detection


The image detection module provides:


- Image upload.
- AI-powered wildlife detection.
- Multiple-animal detection.
- Species classification.
- Bounding-box generation.
- Confidence scoring.
- Annotated image generation.
- Detection result storage.
- Recent detection history.


Example:


```text
Input Image
     |
     v
YOLO Object Detection
     |
     +------------------------+
     |            |           |
   Tiger        Zebra      Giraffe
     |            |           |
 Bounding Box + Confidence Scores
     |
     v
Annotated Image
2. Audio Detection

The audio detection module provides:

Audio upload.
Audio preprocessing.
Feature extraction.
Deep-learning based classification.
Species label mapping.
Confidence scoring.
Detection result storage.
Recent audio detection history.

Example:

Audio Recording
       |
       v
Audio Preprocessing
       |
       v
Feature Extraction
       |
       v
Deep Learning Model
       |
       v
Prediction
       |
       v
Label Encoder
       |
       v
Species + Confidence
3. Species Management

The species module provides a structured representation of wildlife species detected by the system.

It can be used to:

View species information.
Track species detected by the system.
Associate detection records with species.
Support population analysis.
4. Population Monitoring

Population monitoring uses stored detection information to provide:

Species-level observation counts.
Population-related statistics.
Detection history.
Population summaries.
Data for analytics and reporting.
5. Analytics

The analytics module provides a centralized view of wildlife detection data.

It can include:

Total detections.
Image detection statistics.
Audio detection statistics.
Species distribution.
Population-related statistics.
Detection trends.
Recent activity.
6. Reports

The reporting module provides structured wildlife monitoring information based on stored data.

Reports can use:

Detection records.
Species information.
Population observations.
Analytics data.
7. User Management

The system contains user-related functionality for:

User registration.
User authentication.
User information.
Role-related functionality.
User management.
System Architecture
                         +----------------------+
                         |        User          |
                         +----------+-----------+
                                    |
                                    v
                         +----------------------+
                         |   Next.js Frontend   |
                         | TypeScript + React   |
                         +----------+-----------+
                                    |
                              REST API Calls
                                    |
                                    v
                         +----------------------+
                         |   FastAPI Backend    |
                         +----------+-----------+
                                    |
              +---------------------+---------------------+
              |                     |                     |
              v                     v                     v
       Image Detection       Audio Detection       Application APIs
              |                     |                     |
              v                     v                     |
          YOLO Model          Audio ML Model              |
              |                     |                     |
              +----------+----------+                     |
                         |                                |
                         v                                |
                  Detection Results                       |
                         |                                |
                         +---------------+----------------+
                                         |
                                         v
                              +----------------------+
                              |     PostgreSQL       |
                              |      Database        |
                              +----------+-----------+
                                         |
                         +---------------+---------------+
                         |               |               |
                         v               v               v
                    Population       Analytics        Reports
Application Workflow
User
 |
 v
Frontend
 |
 +------------------+
 |                  |
 v                  v
Image Upload      Audio Upload
 |                  |
 v                  v
Image ML Model    Audio ML Model
 |                  |
 v                  v
Detection Result  Classification Result
 |                  |
 +--------+---------+
          |
          v
      FastAPI API
          |
          v
      PostgreSQL
          |
     +----+----+----------------+
     |         |                |
     v         v                v
Population  Analytics        Reports
Machine Learning Pipeline
Image ML Pipeline
Image Upload
     |
     v
Input Validation
     |
     v
Image Preprocessing
     |
     v
YOLO Model Loading
     |
     v
Object Detection
     |
     v
Multiple Bounding Boxes
     |
     v
Species + Confidence
     |
     v
Annotated Image Generation
     |
     v
Detection Records
     |
     v
PostgreSQL

The image model is used to identify wildlife objects within uploaded images.

The system supports multiple detections from the same image, allowing different species to be detected simultaneously.

Audio ML Pipeline
Audio Upload
     |
     v
Input Validation
     |
     v
Audio Preprocessing
     |
     v
Feature Extraction
     |
     v
Trained Audio Model
     |
     v
Prediction
     |
     v
Label Encoder
     |
     v
Species Label
     |
     v
Confidence Score
     |
     v
PostgreSQL
Technology Stack
Frontend
Next.js
React
TypeScript
Tailwind CSS
Backend
Python
FastAPI
REST APIs
SQLAlchemy
Pydantic
Alembic
Machine Learning
Python
YOLO
Computer Vision
Deep Learning
Audio Classification
NumPy
Pandas
Librosa
Scikit-learn
Pillow
TensorFlow / Keras
Database
PostgreSQL
Development and Version Control
Git
GitHub
npm
Python Virtual Environment
Jupyter Notebook
Project Structure
Wildlife-Population-Intelligence-System-Group-1/
│   │   │   ├── audio_service.py
│   │   │   ├── auth_service.py
│   │   │   ├── image_service.py
│   │   │   ├── model_inference.py
│   │   │   ├── population_service.py
│   │   │   ├── report_service.py
│   │   │   ├── species_service.py
│   │   │   └── user_service.py
│   │   │
│   │   └── utils/
│   │       ├── constants.py
│   │       └── helpers.py
│   │
│   ├── models/
│   │   ├── best.pt
│   │   ├── AnimalSoundModel.keras
│   │   ├── audio_model_v2_77.keras
│   │   ├── label_encoder_v2.pkl
│   │   └── README.md
│   │
│   ├── uploads/
│   │
│   ├── .env.example
│   ├── alembic.ini
│   ├── pyproject.toml
│   ├── requirements.txt
│   └── README.md
│
├── frontend/
│   │
│   ├── app/
│   │   ├── dashboard/
│   │   │   ├── analytics/
│   │   │   ├── audio-detection/
│   │   │   ├── image-detection/
│   │   │   ├── insights/
│   │   │   ├── population/
│   │   │   ├── reports/
│   │   │   ├── settings/
│   │   │   ├── species/
│   │   │   └── users/
│   │   ├── forgot-password/
│   │   ├── login/
│   │   ├── register/
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── shared/
│   │   └── ui/
│   │
│   ├── features/
│   │   ├── analytics/
│   │   ├── audio-detection/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── image-detection/
│   │   ├── insights/
│   │   ├── landing/
│   │   ├── population/
│   │   ├── reports/
│   │   ├── settings/
│   │   ├── species/
│   │   ├── users/
│   │   └── shared/
│   │
│   ├── lib/
│   ├── styles/
│   ├── .env.example
│   ├── package.json
│   └── next.config.ts
│
├── wildlife population documentation/
│
├── .gitignore
└── README.md
Machine Learning Models

The trained ML models are stored under:

backend/models/
Image Detection Model
best.pt

This is the trained YOLO model used for wildlife object detection.

The model can detect multiple wildlife objects within a single image and returns:

Detected class
Bounding box
Confidence score
Audio Classification Model
audio_model_v2_77.keras

This model is used for wildlife audio classification.

Additional Audio Model
AnimalSoundModel.keras

An additional trained audio model included in the project.

Label Encoder
label_encoder_v2.pkl

The label encoder maps numerical model outputs to corresponding wildlife species labels.

Backend Architecture

The backend follows a modular layered architecture.

API Router
    |
    v
Service Layer
    |
    v
Repository Layer
    |
    v
SQLAlchemy Models
    |
    v
PostgreSQL

ML inference is handled separately:

API Router
    |
    v
Image / Audio Service
    |
    v
Model Inference Service
    |
    +----> YOLO
    |
    +----> Audio Model
API Layer

Located under:

backend/app/api/v1/

The API layer handles HTTP requests and responses.

Service Layer

Located under:

backend/app/services/

The service layer contains application logic such as:

Image processing.
Audio processing.
ML inference.
Authentication.
Population processing.
Analytics.
Reporting.
Species management.
Repository Layer

Located under:

backend/app/repositories/

The repository layer handles database operations.

Models

Located under:

backend/app/models/

SQLAlchemy models represent the database entities.

Schemas

Located under:

backend/app/schemas/

Pydantic schemas define request and response structures.

Frontend Architecture

The frontend uses Next.js with a feature-oriented structure.

frontend/
│
├── app/
├── components/
├── features/
├── lib/
└── styles/

The dashboard provides modules for:

Overview
Image Detection
Audio Detection
Analytics
Population
Species
Reports
Insights
Users
Settings

Shared UI components are placed under:

frontend/components/shared/

Feature-specific components are organized under:

frontend/features/
Database

The application uses PostgreSQL as its relational database.

The database stores application information including:

Users
Species
Image detections
Audio detections
Population observations
Reports
Related monitoring data

SQLAlchemy is used as the ORM and Alembic is used for schema migrations.

Database Schema Concept

The main entities are:

User
 |
 +--------------------+
                      |
                  Detection
                 /         \
                /           \
        Image Detection   Audio Detection
                \           /
                 \         /
                   Species
                      |
                      v
                 Population
                      |
                +-----+-----+
                |           |
                v           v
             Analytics    Reports
API Modules

The backend API is organized under:

/api/v1

Available modules include:

/api/v1/auth
/api/v1/users
/api/v1/images
/api/v1/audio
/api/v1/species
/api/v1/population
/api/v1/analytics
/api/v1/reports
/api/v1/settings
Authentication

Handles:

Registration
Login
Authentication
User sessions
Protected endpoints
Images

Handles:

Image upload
Image detection
Detection results
Recent image detections
Annotated image output
Audio

Handles:

Audio upload
Audio classification
Audio detection results
Recent audio detections
Species

Handles species-related information.

Population

Handles population-related observations and statistics.

Analytics

Provides aggregated monitoring and detection information.

Reports

Provides reporting-related functionality.

Users

Handles user management.

Settings

Handles application settings.

Installation and Setup
Prerequisites

Install the following before running the project:

Git
Python 3.11 or later
Node.js
npm
PostgreSQL
pip
Clone the Repository
git clone <repository-url>
cd Wildlife-Population-Intelligence-System-Group-1

If you need to work on a specific branch:

git checkout <branch-name>
Backend Setup

Navigate to the backend:

cd backend

Create a virtual environment:

python3.11 -m venv .venv

Activate the environment.

macOS / Linux
source .venv/bin/activate
Windows
.venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt
Database Setup
Start PostgreSQL

Make sure PostgreSQL is running before starting the backend.

Verify PostgreSQL:

pg_isready

A successful result should indicate that PostgreSQL is accepting connections.

Create Database

Create the application database:

createdb wildlife_population

Alternatively:

psql postgres

Then execute:

CREATE DATABASE wildlife_population;

Exit:

\q
Environment Configuration

Copy the example environment file:

cp .env.example .env

Update the database configuration.

Example:

DATABASE_URL=postgresql+psycopg://username:password@localhost:5432/wildlife_population

Use the correct PostgreSQL username and password for the local machine.

Never commit .env to GitHub.

Run Database Migrations

From the backend directory:

alembic upgrade head

Alembic will apply all migration files and create the required database schema.

For example:

alembic/
└── versions/
    ├── initial_schema
    └── image_detections

The PostgreSQL database itself is local to each environment. The migration files allow the schema to be recreated on another machine.

Seed Data

If initial application data is required, use the project's seed functionality:

python -m app.seed

If the current version of the application does not require seed data, this step can be skipped.

Start the Backend

Run:

uvicorn app.main:app --reload

The backend will normally run at:

http://127.0.0.1:8000
FastAPI Documentation

Once the backend is running, open:

http://127.0.0.1:8000/docs

This provides interactive Swagger API documentation.

Alternative documentation:

http://127.0.0.1:8000/redoc
Frontend Setup

Open a new terminal.

Navigate to the frontend:

cd frontend

Install dependencies:

npm install

Create the frontend environment file:

cp .env.example .env.local

Configure the backend API URL if required.

Example:

NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

Start the frontend:

npm run dev

The frontend will normally run at:

http://localhost:3000
Running the Complete Application

Two terminals are recommended.

Terminal 1 — Backend
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload
Terminal 2 — Frontend
cd frontend
npm run dev

Open:

http://localhost:3000
Image Detection Workflow

The complete image detection process is:

User
 |
 v
Select Image
 |
 v
Frontend Upload
 |
 v
POST /api/v1/images/upload
 |
 v
FastAPI
 |
 v
Image Service
 |
 v
YOLO Model
 |
 v
Object Detection
 |
 +-----------------------+
 |                       |
 v                       v
Species              Confidence
 |                       |
 +-----------+-----------+
             |
             v
       Bounding Boxes
             |
             v
     Annotated Image
             |
             v
       Store Results
             |
             v
         PostgreSQL
             |
             v
Frontend Result

The system is designed to support multiple animals in a single image.

For example:

Input:
Tiger + Zebra + Giraffe


Output:


Tiger   → confidence → bounding box
Zebra   → confidence → bounding box
Giraffe → confidence → bounding box

The detection records can then be used by downstream population and analytics modules.

Audio Detection Workflow
User
 |
 v
Select Audio
 |
 v
Frontend Upload
 |
 v
POST /api/v1/audio/upload
 |
 v
FastAPI
 |
 v
Audio Service
 |
 v
Audio Preprocessing
 |
 v
Feature Extraction
 |
 v
Trained Audio Model
 |
 v
Prediction
 |
 v
Label Encoder
 |
 v
Species + Confidence
 |
 v
PostgreSQL
 |
 v
Frontend Result
Database Migrations

Alembic is used to manage database schema changes.

Check migration status:

alembic current

View migration history:

alembic history

Apply migrations:

alembic upgrade head

Create a new migration:

alembic revision --autogenerate -m "description"

Then apply:

alembic upgrade head
Environment Variables

Environment files should not contain hardcoded secrets in the repository.

Example backend environment configuration:

DATABASE_URL=postgresql+psycopg://username:password@localhost:5432/wildlife_population

Example frontend environment configuration:

NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

Use:

.env.example

to document required environment variables without exposing credentials.

API Documentation

After starting the backend, API documentation is available at:

http://127.0.0.1:8000/docs

The API documentation can be used to:

Inspect available endpoints.
Test requests.
Upload images.
Upload audio.
Inspect responses.
Verify authentication.
Debug backend functionality.
Development Workflow

A typical development workflow is:

Create Feature
     |
     v
Create / Update Backend API
     |
     v
Update Database Model
     |
     v
Create Alembic Migration
     |
     v
Implement Service Logic
     |
     v
Connect Frontend
     |
     v
Test API
     |
     v
Test Frontend
     |
     v
Commit Changes
     |
     v
Push Feature Branch
     |
     v
Create Pull Request
Git Workflow

The project uses Git and GitHub for version control.

Before starting work:

git pull

Create or switch to your feature branch:

git checkout -b feature/<feature-name>

Check changes:

git status

Stage changes:

git add .

Commit:

git commit -m "Describe the change"

Push:

git push -u origin feature/<feature-name>

Then create a Pull Request on GitHub.

Important Git Rules

Do not commit:

.env
.env.*
node_modules/
.next/
__pycache__/
.venv/
backend/uploads/
*.tsbuildinfo

Do not commit passwords, API keys, database credentials, or other secrets.

The trained model files required by the project are stored under:

backend/models/
Troubleshooting
PostgreSQL is not running

Check:

pg_isready

If PostgreSQL is not accepting connections, start the PostgreSQL service using the appropriate method for your operating system.

Port 8000 is already in use

Check which process is using port 8000:

lsof -ti:8000

Terminate the process if it is an old backend process:

lsof -ti:8000 | xargs kill

Then start FastAPI again:

uvicorn app.main:app --reload
Database connection error

Check:

PostgreSQL is running.
The database exists.
The username is correct.
The password is correct.
DATABASE_URL in .env is correct.

Test PostgreSQL:

psql postgres
Tables do not exist

Run:

cd backend
alembic upgrade head
ML model not found

Check that the following files exist:

backend/models/best.pt
backend/models/audio_model_v2_77.keras
backend/models/AnimalSoundModel.keras
backend/models/label_encoder_v2.pkl

The backend ML inference service expects the model files in the configured models directory.

Frontend cannot connect to backend

Make sure:

Backend → http://127.0.0.1:8000
Frontend → http://localhost:3000

is running.

Also verify:

NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

and restart the frontend after changing environment variables.

Security and Data Handling

The project follows basic security practices including:

Environment variables for configuration.
Password hashing.
Authentication handling.
Protected backend functionality.
Exclusion of secrets from Git.
Exclusion of local uploads from Git.
Structured API validation using Pydantic.
Database access through SQLAlchemy.

Sensitive configuration should always remain outside the repository.

Project Modules
Module	Description
Dashboard	Overview of wildlife monitoring activity
Image Detection	AI-based wildlife detection from images
Audio Detection	AI-based wildlife sound classification
Species	Wildlife species information and detection records
Population	Population observation and statistics
Analytics	Detection and population analytics
Insights	Wildlife monitoring insights
Reports	Wildlife monitoring reports
Users	User management
Settings	Application settings
Machine Learning Contribution

The machine learning component of the system focuses on automated wildlife recognition.

The image detection pipeline uses a trained YOLO model to:

Detect wildlife objects.
Identify multiple animals.
Generate bounding boxes.
Generate confidence scores.
Produce annotated image results.

The audio pipeline uses a trained deep-learning model to:

Process wildlife audio.
Generate model predictions.
Map predictions to species labels.
Calculate confidence information.

The ML outputs are integrated with the backend so that detection information can be persisted and consumed by other application modules.

Data Flow

The overall data flow is:

                    INPUT
                      |
              +-------+-------+
              |               |
            Image           Audio
              |               |
              v               v
         YOLO Model      Audio Model
              |               |
              +-------+-------+
                      |
                      v
              Detection Result
                      |
                      v
                  FastAPI
                      |
                      v
                 PostgreSQL
                      |
          +-----------+-----------+
          |           |           |
          v           v           v
      Population  Analytics    Reports
          |
          v
       Frontend
Deployment Considerations

For deployment, the following components need to be hosted:

Frontend
   |
   v
Backend API
   |
   +------ PostgreSQL
   |
   +------ ML Models

The deployment environment must provide:

Python runtime.
Node.js runtime if building the frontend on the server.
PostgreSQL or managed PostgreSQL.
Required Python packages.
Required Node.js packages.
Trained ML model files.
Environment variables.
Persistent storage for required application data.

Before deployment:

Configure production environment variables.
Run database migrations.
Verify model files.
Build the frontend.
Start the backend API.
Configure frontend API URL.
Test image detection.
Test audio detection.
Verify database persistence.
Verify analytics and reporting.
Testing Checklist

Before presenting or deploying the project, verify:

Backend
 Backend starts successfully.
 PostgreSQL connection works.
 Alembic migrations apply successfully.
 Authentication works.
 Image upload works.
 Audio upload works.
 Image ML model loads successfully.
 Audio ML model loads successfully.
 Detection results are stored.
 API responses are correct.
Image Detection
 Single-animal detection works.
 Multiple-animal detection works.
 Bounding boxes are generated.
 Confidence scores are displayed.
 Annotated image is returned.
 Multiple species are stored correctly.
Audio Detection
 Audio upload works.
 Audio preprocessing works.
 Model loads correctly.
 Label encoder loads correctly.
 Species label is returned.
 Confidence is returned.
 Result is stored.
Frontend
 Login works.
 Dashboard loads.
 Image detection page works.
 Audio detection page works.
 Population page displays data.
 Analytics displays data.
 Reports display data.
 Species page works.
 Users page works.
 Settings page works.
 API errors are handled properly.
Future Enhancements

Possible future improvements include:

Machine Learning
Improve model accuracy with larger and more diverse datasets.
Add additional wildlife species.
Improve confidence calibration.
Add model evaluation metrics.
Add model version management.
Improve audio classification accuracy.
Add automated model performance monitoring.
Wildlife Monitoring
GPS-based observations.
Location-based wildlife analysis.
Wildlife movement tracking.
Seasonal population trends.
Wildlife migration analysis.
Habitat-based analytics.
Platform
Real-time monitoring.
Cloud deployment.
Role-based access control.
Advanced reporting.
Automated scheduled reports.
Notification system.
Mobile application.
Centralized model management.
Project Documentation

Additional project documentation is available in:

wildlife population documentation/

The documentation contains the detailed project report and supporting project material.

Contributors
Wildlife Population Intelligence System — Group 1

This project was developed collaboratively as part of an AI/ML and software engineering project.

Team members contributed across areas including:

Machine Learning
Computer Vision
Audio Classification
Backend Development
Frontend Development
Database Design
API Integration
Testing
Documentation
Acknowledgements

The project was developed as part of an academic/project-based learning environment with the objective of applying artificial intelligence, machine learning, backend engineering, database management, and frontend development to a real-world wildlife monitoring problem.