#!/bin/bash

# Exit on error
set -e

# Install dependencies
echo "Installing dependencies..."
npm install

# Build frontend
echo "Building frontend..."
cd client
npm install
npm run build
cd ..

# Set up environment
echo "Setting up environment..."

# Create .env files
mkdir -p client/.env
mkdir -p server/.env

# Client .env
echo "REACT_APP_API_URL=${API_URL:-https://stackit-backend.onrender.com/api}" > client/.env

echo "REACT_APP_ENV=${NODE_ENV:-production}" >> client/.env

# Server .env
echo "PORT=${PORT:-5000}" > server/.env

echo "NODE_ENV=${NODE_ENV:-production}" >> server/.env

echo "MONGODB_URI=${MONGODB_URI}" >> server/.env

echo "JWT_SECRET=${JWT_SECRET:-stackit-secret-key-2025}" >> server/.env

echo "SESSION_SECRET=${SESSION_SECRET:-stackit-session-secret-2025}" >> server/.env

echo "CLIENT_URL=${CLIENT_URL:-https://stackit-frontend.onrender.com}" >> server/.env

echo "ALLOWED_ORIGINS=${ALLOWED_ORIGINS:-https://stackit-frontend.onrender.com}" >> server/.env

# Start server
echo "Starting server..."
node server/server.js
