#!/bin/bash

# ========================================================
# EcoVision AI - Run All Services (Git Bash / Linux / WSL)
# ========================================================

echo "🌿 Starting EcoVision AI Services..."

# 1. Start the FastAPI Backend
echo "🚀 Starting FastAPI Backend on port 8000..."
cd backend/wildlife-backend
# If you use a virtual environment, uncomment the following line:
# source venv/Scripts/activate  # Windows Git Bash
# source venv/bin/activate      # Linux/macOS
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
cd ../..

# 2. Start the Next.js Frontend
echo "💻 Starting Next.js Frontend on port 3000..."
cd frontend/wildlife-frontend
npm run dev &
FRONTEND_PID=$!
cd ../..

echo "========================================================"
echo "✅ Both services are starting up!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo "Press [CTRL+C] to stop both services."
echo "========================================================"

# Trap CTRL+C to kill both background processes
trap "echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT SIGTERM

# Wait indefinitely so the script doesn't exit immediately
wait $BACKEND_PID $FRONTEND_PID
