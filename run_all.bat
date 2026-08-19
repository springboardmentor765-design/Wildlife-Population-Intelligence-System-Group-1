@echo off
setlocal

:: ========================================================
:: EcoVision AI - Run All Services (Windows Command Prompt)
:: ========================================================

echo 🌿 Starting EcoVision AI Services...

:: 1. Start the FastAPI Backend in a new windowuvi
echo 🚀 Starting FastAPI Backend on port 8000...
cd backend\wildlife-backend
:: If you use a virtual environment, uncomment the following line:
:: call venv\Scripts\activate
start "EcoVision AI - Backend" cmd /c "uvicorn main:app --reload --port 8000"
cd ..\..

:: 2. Start the Next.js Frontend in a new window
echo 💻 Starting Next.js Frontend on port 3000...
cd frontend\wildlife-frontend
start "EcoVision AI - Frontend" cmd /c "npm run dev"
cd ..\..

echo ========================================================
echo ✅ Both services are starting up in separate windows!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo Close the newly opened terminal windows to stop the services.
echo ========================================================

pause
