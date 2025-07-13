#!/bin/bash

# Exit on error
set -e

# Function to check if command exists
command_exists() {
    type "$1" &> /dev/null
}

# Check prerequisites
echo "Checking prerequisites..."

if ! command_exists node; then
    echo "Error: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check MongoDB
if [ "$NODE_ENV" != "production" ]; then
    if ! command_exists mongod; then
        echo "Error: MongoDB is not installed"
        echo "Please install MongoDB from https://www.mongodb.com/try/download/community"
        exit 1
    fi
fi

# Install dependencies
echo "Installing dependencies..."
npm install

cd client
npm install
cd ..

cd server
npm install
cd ..

cd scripts
npm install
cd ..

# Build frontend
echo "Building frontend..."
cd client
npm run build
cd ..

# Start application
echo "Starting application..."

if [ "$NODE_ENV" = "production" ]; then
    echo "Starting in cloud mode..."
    npm run start-cloud
else
    echo "Starting in development mode..."
    npm run dev:full
fi

echo "Application started successfully!"
echo "Environment: $NODE_ENV"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"
