# 🦁 Wildlife Population Intelligence System — Frontend

<p align="center">
  <strong>Modern Next.js dashboard for wildlife monitoring, AI detection, population analytics, maps, reports, and conservation intelligence.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Recharts-Analytics-FF6384?style=for-the-badge" alt="Recharts"/>
  <img src="https://img.shields.io/badge/Axios-API_Client-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios"/>
  <img src="https://img.shields.io/badge/REST_API-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="REST API"/>
</p>

---

# 📌 Overview

The **Wildlife Population Intelligence System Frontend** is a modern, responsive web application built with **Next.js and React**.

It provides a centralized interface for interacting with the wildlife intelligence backend and enables users to:

* 📊 Monitor wildlife populations
* 📷 Upload wildlife images
* 🎥 Process wildlife videos
* 🎙️ Analyze wildlife audio
* 🗺️ Explore wildlife locations
* 📈 Visualize population trends
* 🚨 Monitor alerts and anomalies
* 📄 Generate and view reports
* 👥 Access role-specific dashboards

The frontend communicates with the **FastAPI backend through REST APIs**.

---

# 🏗️ Frontend Architecture

```text
                         ┌──────────────────────────────┐
                         │      ECO VISION AI           │
                         │  Wildlife Intelligence UI   │
                         └──────────────┬───────────────┘
                                        │
                                        ▼
                         ┌──────────────────────────────┐
                         │       Next.js Application    │
                         │                              │
                         │ App Router • React • UI      │
                         └──────────────┬───────────────┘
                                        │
              ┌─────────────────────────┼─────────────────────────┐
              │                         │                         │
              ▼                         ▼                         ▼
      ┌───────────────┐        ┌────────────────┐        ┌───────────────┐
      │   Dashboard   │        │ Upload Center  │        │ Maps & GIS    │
      │               │        │                │        │               │
      │ Analytics     │        │ Images         │        │ Wildlife      │
      │ Population    │        │ Videos         │        │ Locations     │
      │ Biodiversity  │        │ Audio          │        │ Habitats      │
      └───────┬───────┘        └───────┬────────┘        └───────┬───────┘
              │                         │                         │
              └─────────────────────────┼─────────────────────────┘
                                        │
                                        ▼
                              ┌──────────────────┐
                              │ API Client Layer │
                              │                  │
                              │ Axios / Fetch    │
                              └────────┬─────────┘
                                       │
                                  REST / HTTPS
                                       │
                                       ▼
                              ┌──────────────────┐
                              │ FastAPI Backend  │
                              │                  │
                              │ AI • Database    │
                              │ Authentication   │
                              │ Analytics        │
                              └──────────────────┘
```

---

# 🧩 Frontend Responsibilities

The frontend acts as the **presentation and interaction layer** of the platform.

```text
User
 │
 ▼
Next.js UI
 │
 ├── Dashboard
 ├── Detection
 ├── Audio
 ├── Video
 ├── Maps
 ├── Analytics
 ├── Reports
 └── Administration
 │
 ▼
API Client
 │
 ▼
FastAPI Backend
```

The frontend does not directly access the database. All persistent data operations are performed through backend APIs.

---

# 📂 Project Structure

A recommended frontend structure is:

```text
wildlife-frontend/
│
├── app/
│   ├── dashboard/
│   ├── detection/
│   ├── audio/
│   ├── video/
│   ├── map/
│   ├── reports/
│   ├── analytics/
│   ├── login/
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── dashboard/
│   ├── detection/
│   ├── audio/
│   ├── video/
│   ├── maps/
│   ├── reports/
│   ├── charts/
│   ├── navigation/
│   └── ui/
│
├── hooks/
│   ├── useAuth.ts
│   ├── useDetection.ts
│   ├── useDashboard.ts
│   └── useReports.ts
│
├── lib/
│   ├── api.ts
│   ├── auth.ts
│   ├── constants.ts
│   └── utils.ts
│
├── public/
│   ├── images/
│   ├── icons/
│   └── assets/
│
├── styles/
│
├── .env.local
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

> The exact directory structure can vary depending on the current implementation. The structure above represents the recommended organization for maintaining a scalable frontend.

---

# 🖥️ Main Application Modules

## 📊 1. Dashboard

The dashboard provides a high-level overview of wildlife intelligence.

### Key Metrics

* 🐾 Total species
* 📷 Total detections
* 📈 Population trends
* 🌿 Biodiversity health
* 🚨 Active alerts
* 🗺️ Wildlife distribution
* 🎯 AI confidence
* 📅 Detection activity

Example:

```text
┌────────────────────────────────────────────────────┐
│                 Wildlife Dashboard                 │
├────────────┬────────────┬────────────┬─────────────┤
│ Species    │ Detections │ Population │ Alerts      │
│    24      │   1,842    │   3,421    │     12      │
├────────────┴────────────┴────────────┴─────────────┤
│                                                    │
│              Population Trend Chart                │
│                                                    │
├──────────────────────────┬─────────────────────────┤
│ Species Distribution      │ Wildlife Map           │
│                          │                         │
└──────────────────────────┴─────────────────────────┘
```

---

# 📷 2. Wildlife Detection

The detection interface allows users to submit wildlife images for AI analysis.

### Workflow

```text
Select Image
     │
     ▼
Upload
     │
     ▼
FastAPI API
     │
     ▼
YOLO AI Engine
     │
     ▼
Detection Results
     │
     ├── Species
     ├── Confidence
     └── Bounding Box
     │
     ▼
Frontend Result View
```

### UI Responsibilities

* File selection
* Upload progress
* Preview
* Detection status
* Result visualization
* Confidence display
* Bounding-box rendering
* Detection history

---

# 🎥 3. Video Intelligence

The video module provides a user interface for wildlife video processing.

### Workflow

```text
Video Upload
      │
      ▼
Frontend
      │
      ▼
FastAPI
      │
      ▼
Video Processing
      │
      ▼
AI Detection
      │
      ▼
Aggregated Results
      │
      ▼
Analytics UI
```

The interface can display:

* Video preview
* Processing status
* Detected species
* Detection count
* Confidence metrics
* Processing results

---

# 🎙️ 4. Bioacoustic Intelligence

The audio module allows users to submit wildlife recordings.

```text
Audio File
    │
    ▼
Upload UI
    │
    ▼
REST API
    │
    ▼
Audio AI Engine
    │
    ▼
Species Prediction
    │
    ▼
Confidence
    │
    ▼
Audio Intelligence UI
```

Possible frontend components:

* Audio uploader
* Audio player
* Processing indicator
* Species prediction card
* Confidence visualization
* Analysis history

---

# 🗺️ 5. Wildlife Map

The map interface provides geographic visualization of wildlife observations.

### Map Data

```text
GPS Coordinates
      │
      ▼
Backend API
      │
      ▼
Frontend Map
      │
      ├── Species Locations
      ├── Detection Density
      ├── Habitat Areas
      └── Wildlife Activity
```

Potential future functionality:

* Interactive markers
* Species filtering
* Date filtering
* Habitat layers
* Detection heatmaps
* GPS trails
* Conservation zones

---

# 📈 6. Analytics

The analytics interface transforms backend data into visual insights.

### Charts

* Population trends
* Species distribution
* Monthly detections
* Biodiversity trends
* Detection confidence
* Habitat distribution
* Alert frequency

Example:

```text
Raw Data
   │
   ▼
FastAPI Analytics API
   │
   ▼
Frontend Data Processing
   │
   ▼
Recharts
   │
   ▼
Interactive Visualization
```

---

# 🚨 7. Alerts

The alerts interface provides visibility into unusual wildlife activity.

Possible alert categories:

```text
🚨 Population Anomaly
🐾 Rare Species Detection
📉 Population Decline
📈 Unusual Population Increase
📍 Geographic Anomaly
🎯 Low Confidence Detection
```

Example UI:

```text
┌──────────────────────────────────────────┐
│             Wildlife Alerts              │
├──────────────────────────────────────────┤
│ 🚨 Population anomaly detected           │
│    Tiger population ↓ 18%                │
│                                          │
│ 🐾 Rare species detected                 │
│    Species: Example Species              │
│                                          │
│ 📍 Unusual activity                      │
│    Zone: Northern Habitat                │
└──────────────────────────────────────────┘
```

---

# 📄 8. Reports

The frontend provides access to generated wildlife reports.

Supported report types may include:

* Detection summaries
* Population reports
* Species reports
* Conservation reports
* Analytics exports

Typical workflow:

```text
Frontend
   │
   ▼
Reports API
   │
   ▼
FastAPI
   │
   ▼
Report Generator
   │
   ▼
Generated File
   │
   ▼
Frontend Download / Preview
```

---

# 👥 Role-Based UI

The frontend can provide role-specific navigation and dashboards.

## 👨‍🔬 Researcher

```text
Dashboard
├── Wildlife Detection
├── Population Analytics
├── Species Analysis
├── Maps
└── Reports
```

## 🌳 Conservation Officer

```text
Dashboard
├── Population Monitoring
├── Alerts
├── Habitat Intelligence
├── Wildlife Maps
└── Conservation Reports
```

## 🛠️ Administrator

```text
Dashboard
├── User Management
├── Wildlife Data
├── System Monitoring
├── Reports
└── Administration
```

> Frontend role checks improve the user experience, but authorization must also be enforced by the FastAPI backend.

---

# 🔌 API Integration

The frontend communicates with the FastAPI backend using REST APIs.

Example architecture:

```text
Next.js
   │
   ▼
API Client
   │
   ├── Authentication API
   ├── Detection API
   ├── Dashboard API
   ├── Audio API
   ├── Video API
   ├── Map API
   └── Reports API
   │
   ▼
FastAPI
```

---

# ⚙️ API Client

Centralizing API communication is recommended.

Example:

```text
lib/
└── api.ts
```

Conceptually:

```text
Component
    │
    ▼
Custom Hook
    │
    ▼
API Client
    │
    ▼
FastAPI Endpoint
```

This keeps API logic separate from UI components.

---

# 🔐 Authentication Flow

```text
                  Login Page
                      │
                      ▼
                Login Request
                      │
                      ▼
                 FastAPI API
                      │
                      ▼
             Credential Validation
                      │
                      ▼
                  JWT Token
                      │
                      ▼
              Frontend Session
                      │
                      ▼
             Protected Dashboard
```

Protected requests include:

```http
Authorization: Bearer <ACCESS_TOKEN>
```

---

# 📤 File Upload Architecture

The frontend supports media upload workflows.

```text
                 User
                  │
                  ▼
            Upload Component
                  │
                  ▼
            File Validation
                  │
                  ▼
             FormData
                  │
                  ▼
             API Client
                  │
                  ▼
             FastAPI API
                  │
                  ▼
           AI / ML Processing
                  │
                  ▼
              Results
                  │
                  ▼
             Result UI
```

Client-side validation should include:

* Supported file extensions
* MIME type
* File size
* Required fields
* Upload state

Server-side validation remains mandatory.

---

# 🎨 UI & Design System

The frontend uses **Tailwind CSS** for responsive styling and can use reusable UI components to maintain design consistency.

Recommended UI principles:

* Responsive layouts
* Accessible components
* Consistent spacing
* Clear information hierarchy
* Reusable components
* Loading states
* Empty states
* Error states
* Mobile-friendly navigation

---

# 📊 Data Visualization

**Recharts** can be used for interactive analytics.

Example visualization categories:

```text
Population
    ├── Line Chart
    └── Area Chart

Species
    ├── Bar Chart
    └── Pie / Donut Chart

Detection
    ├── Timeline
    └── Heatmap

Habitat
    └── Distribution Chart
```

---

# 🔄 Frontend Data Lifecycle

```text
API Request
    │
    ▼
Loading State
    │
    ├───────────────┐
    │               │
    ▼               ▼
Success           Error
    │               │
    ▼               ▼
Transform        Error UI
Data
    │
    ▼
Render Component
    │
    ▼
User Interaction
```

Every asynchronous feature should provide appropriate:

* Loading state
* Success state
* Error state
* Empty state

---

# 🌐 Environment Configuration

Create:

```text
.env.local
```

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production:

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

> Do not expose private secrets through `NEXT_PUBLIC_*` variables. Any variable prefixed with `NEXT_PUBLIC_` can be exposed to the browser.

---

# 🚀 Local Development

## 1. Navigate to Frontend

```bash
cd frontend/wildlife-frontend
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment

Create:

```text
.env.local
```

Configure the backend URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 4. Start Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 🏗️ Production Build

Create an optimized production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

---

# 🧪 Testing

Run the project's configured test command:

```bash
npm test
```

For linting:

```bash
npm run lint
```

For TypeScript validation, if configured:

```bash
npx tsc --noEmit
```

---

# 🐳 Docker

The frontend can be containerized as part of the complete application.

Conceptual deployment:

```text
Docker Compose
      │
      ├── Next.js
      │
      └── FastAPI
             │
             ▼
       Neon PostgreSQL
```

The root-level `docker-compose.yml` should be used when running the complete application stack.

---

# 📱 Responsive Design

The frontend is intended to support:

```text
Desktop
   │
   ├── Dashboard
   ├── Analytics
   ├── Maps
   └── Reports

Tablet
   │
   ├── Responsive Dashboard
   └── Adaptive Navigation

Mobile
   │
   ├── Mobile Navigation
   ├── Compact Analytics
   └── Mobile Upload
```

---

# 🧭 Recommended Navigation

```text
ECO VISION AI
│
├── 🏠 Dashboard
│
├── 🐾 Wildlife
│   ├── Detection
│   ├── Species
│   └── History
│
├── 🎙️ Bioacoustics
│   ├── Upload Audio
│   └── Analysis
│
├── 🎥 Video Intelligence
│   ├── Upload Video
│   └── Results
│
├── 🗺️ Wildlife Map
│
├── 📊 Analytics
│
├── 🚨 Alerts
│
├── 📄 Reports
│
└── ⚙️ Settings
```

---

# 🔄 End-to-End Frontend Flow

```text
                         USER
                          │
                          ▼
                 ┌─────────────────┐
                 │  Next.js UI     │
                 └────────┬────────┘
                          │
          ┌───────────────┼────────────────┐
          │               │                │
          ▼               ▼                ▼
      Dashboard       Upload Center      Maps
          │               │                │
          └───────────────┼────────────────┘
                          ▼
                     API Client
                          │
                          ▼
                    REST / HTTPS
                          │
                          ▼
                    FastAPI Backend
                          │
                 ┌────────┴────────┐
                 ▼                 ▼
              AI / ML          Database
                 │                 │
                 └────────┬────────┘
                          ▼
                    API Response
                          │
                          ▼
                   Next.js State
                          │
                          ▼
                  Analytics / UI
```

---

# 🔒 Frontend Security

Recommended security practices:

* Never store private API keys in frontend code
* Never expose database credentials
* Use HTTPS in production
* Validate uploaded files
* Handle expired authentication tokens
* Avoid rendering untrusted HTML
* Implement proper logout behavior
* Protect sensitive routes
* Rely on backend authorization for actual access control
* Configure API CORS correctly

---

# ⚡ Performance Considerations

For production scalability, consider:

* Next.js Server Components where appropriate
* Dynamic imports
* Image optimization
* Lazy loading
* Pagination
* Debounced search
* API response caching
* Memoized expensive components
* Virtualized large data tables
* Optimized chart rendering

For large wildlife datasets, pagination and server-side filtering should be preferred over loading the complete dataset into the browser.

---

# 🧩 Component Architecture

A scalable component hierarchy can follow:

```text
app/
 │
 ├── Pages
 │
 ▼
components/
 │
 ├── Layout
 ├── Navigation
 ├── Dashboard
 ├── Detection
 ├── Audio
 ├── Video
 ├── Maps
 ├── Analytics
 ├── Reports
 └── UI
```

Reusable components should handle presentation while data-fetching logic remains in hooks or API utilities.

---

# 🗺️ Frontend Roadmap

* [ ] Advanced wildlife map
* [ ] Real-time dashboard updates
* [ ] Live detection monitoring
* [ ] Advanced video player
* [ ] Interactive detection bounding boxes
* [ ] Wildlife tracking visualization
* [ ] Population forecasting charts
* [ ] Advanced GIS layers
* [ ] Real-time alerts
* [ ] Offline-friendly workflows
* [ ] Progressive Web App support
* [ ] Mobile optimization
* [ ] Accessibility improvements
* [ ] Advanced dashboard customization

---

# 🔗 Backend Integration

The frontend depends on the FastAPI backend for:

```text
Authentication
     +
Wildlife Detection
     +
Audio Analysis
     +
Video Processing
     +
Population Analytics
     +
Maps
     +
Alerts
     +
Reports
```

Backend documentation:

```text
backend/wildlife-backend/README.md
```

---

# 🌍 ECO VISION AI Frontend

```text
┌──────────────────────────────────────────────────────┐
│                    ECO VISION AI                     │
│              Wildlife Intelligence UI               │
├──────────────────────────────────────────────────────┤
│                                                      │
│       🐾 Detect       📊 Analyze       🗺️ Explore   │
│                                                      │
│       🎙️ Listen      🚨 Monitor       📄 Report     │
│                                                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│             DATA → INTELLIGENCE → ACTION             │
│                                                      │
└──────────────────────────────────────────────────────┘
```

> **Observe. Analyze. Predict. Protect. 🦁🌿**
