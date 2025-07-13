@echo off

:: Check if Node.js is installed
echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
    exit /b 1
)

echo Node.js is installed

:: Check if MongoDB is installed
echo Checking MongoDB installation...
mongod --version >nul 2>&1
if errorlevel 1 (
    echo Error: MongoDB is not installed
    echo Please install MongoDB from https://www.mongodb.com/try/download/community
    exit /b 1
)

echo MongoDB is installed

:: Install dependencies
echo Installing dependencies...
call npm install
cd client
call npm install
cd ..
cd server
call npm install
cd ..

if errorlevel 1 (
    echo Error: Failed to install dependencies
    exit /b 1
)

:: Build frontend
echo Building frontend...
cd client
call npm run build
cd ..

if errorlevel 1 (
    echo Error: Failed to build frontend
    exit /b 1
)

:: Create .env files if they don't exist
if not exist server\.env (
    echo Creating server .env file...
    echo PORT=5000 > server\.env
    echo NODE_ENV=development >> server\.env
    echo MONGODB_URI=mongodb://localhost:27017/stackit >> server\.env
    echo JWT_SECRET=your-secret-key >> server\.env
    echo SESSION_SECRET=your-session-secret >> server\.env
    echo CLIENT_URL=http://localhost:3000 >> server\.env
)

if not exist client\.env (
    echo Creating client .env file...
    echo REACT_APP_API_URL=http://localhost:5000/api >> client\.env
    echo REACT_APP_ENV=development >> client\.env
)

:: Start MongoDB
echo Starting MongoDB...
start "MongoDB" mongod

echo Starting application...

:: Start backend in new window
start "Backend Server" cmd /k "cd server && npm run dev"

:: Start frontend in new window
start "Frontend Server" cmd /k "cd client && npm start"

echo Application started successfully!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
echo API: http://localhost:5000/api

echo Press any key to exit...
pause >nul
