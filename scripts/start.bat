@echo off

echo Starting StackIt...

echo Checking Node.js version...
node --version

if errorlevel 1 (
    echo Node.js is not installed. Please install Node.js 18 or higher.
    exit /b 1
)

:: Install dependencies
echo Installing dependencies...
cd server
call npm install
cd ../client
call npm install

:: Start servers
echo Starting servers...

echo Starting backend server...
start cmd /k "cd server && npm run dev"

echo Starting frontend server...
start cmd /k "cd client && npm start"

echo Servers are starting. Please wait a moment...

echo Opening browser...
start http://localhost:3000

:: Wait for user to exit
pause
