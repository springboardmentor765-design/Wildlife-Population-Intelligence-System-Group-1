# 🦁 Wildlife Population Intelligence System

<p align="center">

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss)
![YOLO](https://img.shields.io/badge/YOLO-Ultralytics-111827?style=for-the-badge)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</p>

---

# 🌍 Overview

The **Wildlife Population Intelligence System** is a modern AI-powered conservation platform that combines **Computer Vision**, **Bioacoustic Intelligence**, and **Wildlife Analytics** to monitor biodiversity and ecosystem health.

The platform processes:

- 📷 Camera Trap Images
- 🚁 Drone Imagery
- 🎙️ Bioacoustic Recordings

to automatically identify wildlife species, estimate population statistics, generate conservation insights, and provide interactive dashboards for researchers and conservation agencies.

---

# ✨ Key Features

## 🤖 AI Wildlife Detection

- YOLO-powered wildlife detection
- Bounding Box Generation
- Confidence Score Prediction
- Species Classification

---

## 🌿 Biodiversity Intelligence

- Habitat Classification
- Animal Behavior Prediction
- Population Health Analysis
- Ecosystem Health Score
- Biodiversity Trend Monitoring

---

## 🎙️ Bioacoustic Intelligence

- Audio Upload
- Wildlife Sound Detection
- Species Estimation
- Acoustic Pattern Recognition

(Mock AI Engine)

---

## 📊 Analytics Dashboard

Interactive dashboards including:

- Species Distribution
- Population Trends
- Detection Heatmaps
- Habitat Analysis
- Ecosystem Health
- Threat Assessment
- Monthly Reports

Built using **Recharts + React**.

---

## 👥 Role-Based Access

Three dedicated dashboards:

- 👨‍🔬 Researcher
- 🌳 Conservation Officer
- 🛠 Administrator

Each dashboard exposes different insights and permissions.

---

## 📄 Automated Reports

Generate downloadable:

- Excel Reports
- Wildlife Intelligence Reports
- Detection Summaries
- Population Statistics

Powered by **Pandas + OpenPyXL**.

---

# 🏗 System Architecture

```
                Camera Images
                      │
                      ▼
             YOLO Detection Engine
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
 Species Detection          Habitat Analysis
        │                           │
        └─────────────┬─────────────┘
                      ▼
          Conservation Intelligence
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
    SQLite Database          Report Generator
        │                           │
        └─────────────┬─────────────┘
                      ▼
                 FastAPI Backend
                      │
                 REST API + JWT
                      │
                      ▼
        Next.js Frontend Dashboard
```

---

# ⚙️ Tech Stack

## Frontend

- Next.js
- React
- Tailwind CSS
- Framer Motion
- Recharts
- Axios

---

## Backend

- FastAPI
- SQLAlchemy
- SQLite
- JWT Authentication
- Pandas
- OpenPyXL

---

## Artificial Intelligence

- Ultralytics YOLO
- OpenCV
- NumPy
- Mock Bioacoustic Engine

---

## DevOps

- Docker
- Docker Compose
- Git
- GitHub

---

# 📂 Project Structure

```
Wildlife-Population-Intelligence-System
│
├── backend
│   ├── wildlife-backend
│   │   ├── routers
│   │   ├── models
│   │   ├── services
│   │   ├── database
│   │   ├── uploads
│   │   ├── results
│   │   ├── reports
│   │   ├── main.py
│   │   └── requirements.txt
│
├── frontend
│   ├── wildlife-frontend
│   │   ├── app
│   │   ├── components
│   │   ├── hooks
│   │   ├── lib
│   │   ├── public
│   │   └── package.json
│
├── docker-compose.yml
├── README.md
└── LICENSE
```

---

# 🚀 Quick Start

## Using Docker (Recommended)

### Clone Repository

```bash
git clone https://github.com/yourusername/Wildlife-Population-Intelligence-System.git

cd Wildlife-Population-Intelligence-System
```

### Build Containers

```bash
docker-compose up --build
```

---

After startup:

| Service | URL |
|----------|-----|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:8000 |
| Swagger Docs | http://localhost:8000/docs |
| ReDoc | http://localhost:8000/redoc |

---

# 💻 Local Development

## Backend

```bash
cd backend/wildlife-backend

python -m venv venv

source venv/bin/activate

# Windows
venv\Scripts\activate

pip install -r requirements.txt

uvicorn main:app --reload
```

Backend runs on

```
http://localhost:8000
```

---

## Frontend

```bash
cd frontend/wildlife-frontend

npm install

npm run dev
```

Runs on

```
http://localhost:3000
```

---

# 🔑 Authentication

The backend uses **JWT Authentication**.

Supported Roles:

- Researcher
- Conservation Officer
- Administrator

Protected API routes require a valid Bearer Token.

---

# 📷 Image Processing Workflow

```
Upload Image
      │
      ▼
YOLO Detection
      │
Bounding Boxes
      │
Species Prediction
      │
Habitat Detection
      │
Population Statistics
      │
Database Storage
      │
Dashboard Visualization
```

---

# 🎙 Bioacoustic Workflow

```
Upload Audio

↓

Feature Extraction

↓

Species Prediction

↓

Confidence Estimation

↓

Wildlife Report
```

---

# 📈 Dashboard Analytics

The dashboard provides:

- Species Count
- Endangered Species
- Ecosystem Health Score
- Habitat Distribution
- Monthly Population Growth
- Detection Timeline
- AI Confidence Metrics

---

# 📡 REST API

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /detect | Wildlife Detection |
| POST | /upload-audio | Audio Analysis |
| GET | /species | Species List |
| GET | /dashboard | Analytics |
| GET | /reports | Excel Reports |
| POST | /login | JWT Login |

---

# 📸 Screenshots

## 🖥️ Dashboard

<p align="center">
  <img src="screenshots/image1.png" alt="Dashboard Home" width="900"/>
  <br><br>
  <img src="screenshots/image2.png" alt="Research Dashboard" width="900"/>
</p>

---

## 🎯 AI Wildlife Detection

<p align="center">
  <img src="screenshots/image3.png" alt="Wildlife Detection Result" width="900"/>
</p>

---

## 📊 Analytics Dashboard

<p align="center">
  <img src="screenshots/image4.png" alt="Species Analytics" width="900"/>
  <br><br>
  <img src="screenshots/image5.png" alt="Population Insights" width="900"/>
</p>

---

## 📄 Report Generator

<p align="center">
  <img src="screenshots/image6.png" alt="Excel Report Generation" width="900"/>
  <br><br>
  <img src="screenshots/image7.png" alt="Generated Conservation Report" width="900"/>
</p>

---

# 📊 Future Improvements

- Real Bioacoustic AI
- Multi-camera Tracking
- GPS Wildlife Mapping
- Satellite Image Analysis
- Mobile Application
- Live Drone Feed Processing
- AI Species Recommendation
- GIS Integration
- Multi-language Support

---

# 🧪 Testing

Backend

```bash
pytest
```

Frontend

```bash
npm test
```

---

# 🤝 Contributing

Contributions are welcome.

1. Fork Repository

2. Create Feature Branch

```bash
git checkout -b feature/new-feature
```

3. Commit Changes

```bash
git commit -m "Add new feature"
```

4. Push

```bash
git push origin feature/new-feature
```

5. Create Pull Request

---

# ⭐ Support

If you found this project helpful, please consider giving it a ⭐ on GitHub.

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

**Ashwin Chauhan**

Computer Science Engineer

AI • Computer Vision • Machine Learning • Full Stack Development • FastAPI • Next.js • YOLO • Docker

---

## 🌟 Why This Project?

This platform demonstrates how Artificial Intelligence can empower wildlife conservation by combining computer vision, biodiversity analytics, and modern web technologies into a scalable end-to-end solution. It serves as a practical example of applying AI to real-world environmental challenges, enabling researchers and conservation teams to make data-driven decisions for protecting endangered species and preserving ecosystems.