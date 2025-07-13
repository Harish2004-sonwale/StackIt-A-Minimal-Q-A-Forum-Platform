@echo off

echo Starting StackIt application...

echo Checking Node.js installation...
node --version
if errorlevel 1 (
    echo Node.js is not installed. Please install Node.js from https://nodejs.org/
    exit /b 1
)

echo Installing dependencies...
call npm install
cd client
call npm install
cd ..
cd server
call npm install
cd ..
cd scripts
call npm install
cd ..

if errorlevel 1 (
    echo Failed to install dependencies
    exit /b 1
)

echo Building frontend...
cd client
call npm run build
cd ..

if errorlevel 1 (
    echo Failed to build frontend
    exit /b 1
)

echo Starting application...

REM Check if we're in cloud environment
if "%NODE_ENV%"=="production" (
    echo Starting in cloud mode...
    call npm run start-cloud
) else (
    echo Starting in development mode...
    start npm run dev:full
)

echo Application started successfully!
echo Environment: %NODE_ENV%
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000

pause
