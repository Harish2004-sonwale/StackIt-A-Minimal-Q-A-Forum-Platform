#!/bin/bash

# Exit on error
set -e

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
npm install mongodb moment
cd ..

# Build frontend
echo "Building frontend..."
cd client
npm run build
cd ..

# Set up environment variables
echo "Setting up environment variables..."

# Backend environment
sed -i 's/<username>/your-mongodb-username/g' render.json
sed -i 's/<password>/your-mongodb-password/g' render.json

# Create .env files
mkdir -p client/.env
mkdir -p server/.env

# Client .env
echo "REACT_APP_API_URL=https://stackit-backend.onrender.com/api" > client/.env

echo "REACT_APP_ENV=production" >> client/.env

# Server .env
echo "PORT=5000" > server/.env

echo "MONGODB_URI=mongodb+srv://your-mongodb-username:your-mongodb-password@cluster0.mongodb.net/stackit" >> server/.env

echo "JWT_SECRET=your-secret-key" >> server/.env

echo "SESSION_SECRET=your-session-secret" >> server/.env

echo "CLIENT_URL=https://stackit-frontend.onrender.com" >> server/.env

# Push to GitHub
echo "Pushing to GitHub..."
git add .
git commit -m "Prepare for cloud deployment"
git push origin master

echo "Deployment complete!"
echo "Now deploy to Render using:"
echo "1. Go to https://render.com"
echo "2. Click 'New +', then 'Web Service'"
echo "3. Connect your GitHub repository"
echo "4. Select the appropriate branch"
echo "5. Configure environment variables as needed"

echo "Your application will be live at:"
echo "Frontend: https://stackit-frontend.onrender.com"
echo "Backend: https://stackit-backend.onrender.com"
