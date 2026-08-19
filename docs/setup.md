# Setup — Local Development

## Backend Setup

Navigate to the backend:

```bash
cd backend/wildlife-backend
```

Create a virtual environment:

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

Backend:

```text
http://localhost:8000
```

---

# 🌐 Frontend Setup

Open another terminal:

```bash
cd frontend/wildlife-frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend:

```text
http://localhost:3000
```








