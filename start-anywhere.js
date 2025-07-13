const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// Detect environment
const isCloud = process.env.NODE_ENV === 'production';
const isLocal = !isCloud;

// Function to check if MongoDB is running
const checkMongoDB = () => {
    try {
        if (isCloud) {
            // For cloud, just check if MONGODB_URI is set
            if (!process.env.MONGODB_URI) {
                console.error('Error: MONGODB_URI is not set');
                return false;
            }
            return true;
        }

        // For local, check if MongoDB is running
        try {
            execSync('mongod --version', { stdio: 'ignore' });
            return true;
        } catch (err) {
            console.error('Error: MongoDB is not installed or not running');
            return false;
        }
    } catch (error) {
        console.error('Error checking MongoDB:', error);
        return false;
    }
};

// Function to check Node.js version
const checkNodeVersion = () => {
    try {
        const version = execSync('node --version').toString().trim();
        console.log(`Node.js version: ${version}`);
        return true;
    } catch (error) {
        console.error('Error: Node.js is not installed');
        return false;
    }
};

// Function to install dependencies
const installDependencies = () => {
    try {
        console.log('Installing dependencies...');
        execSync('npm install', { stdio: 'inherit' });
        
        console.log('Installing frontend dependencies...');
        execSync('cd client && npm install', { stdio: 'inherit' });
        
        console.log('Installing server dependencies...');
        execSync('cd server && npm install', { stdio: 'inherit' });
        return true;
    } catch (error) {
        console.error('Error installing dependencies:', error);
        return false;
    }
};

// Function to build frontend
const buildFrontend = () => {
    try {
        console.log('Building frontend...');
        execSync('cd client && npm run build', { stdio: 'inherit' });
        return true;
    } catch (error) {
        console.error('Error building frontend:', error);
        return false;
    }
};

// Function to start the application
const startApplication = () => {
    try {
        if (isCloud) {
            console.log('Starting cloud environment...');
            execSync('npm run start-cloud', { stdio: 'inherit' });
        } else {
            console.log('Starting local development environment...');
            execSync('npm run dev:full', { stdio: 'inherit' });
        }
        return true;
    } catch (error) {
        console.error('Error starting application:', error);
        return false;
    }
};

// Main function to run the application
const runApp = async () => {
    console.log('Starting StackIt application...');
    
    // Check prerequisites
    if (!checkNodeVersion()) {
        console.error('Node.js is required to run this application');
        return;
    }

    if (!checkMongoDB()) {
        console.error('MongoDB is required to run this application');
        return;
    }

    // Install dependencies
    if (!installDependencies()) {
        console.error('Failed to install dependencies');
        return;
    }

    // Build frontend
    if (!buildFrontend()) {
        console.error('Failed to build frontend');
        return;
    }

    // Start application
    if (!startApplication()) {
        console.error('Failed to start application');
        return;
    }

    console.log('Application started successfully!');
    console.log(`Environment: ${isCloud ? 'Cloud' : 'Local'}`);
    console.log(`Frontend: http://localhost:3000`);
    console.log(`Backend: http://localhost:5000`);
};

// Run the application
runApp().catch(error => {
    console.error('Failed to run application:', error);
});
