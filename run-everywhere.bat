@echo off

echo Running StackIt in any environment...

:: Check if Node.js is installed
echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed
    echo Downloading Node.js...
    powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v18.x/node-v18.x-x64.msi' -OutFile 'nodejs.msi'"
    msiexec /i nodejs.msi /quiet
)

echo Node.js is installed

:: Run deployment script
node deploy-anywhere.js

:: Wait for user input
echo Deployment complete!
echo Press any key to exit...
pause >nul
