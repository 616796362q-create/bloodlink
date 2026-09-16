@echo off
echo Cleaning old background servers on port 3000 and 5000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1

echo Starting Backend Server on port 5000...
start "Madahiye Backend" cmd /k "cd backend && npm start"

echo Starting Frontend Dev Server on port 3000...
start "Madahiye Frontend" cmd /k "cd frontend && npm run dev"

echo Madahiye system started successfully!
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
