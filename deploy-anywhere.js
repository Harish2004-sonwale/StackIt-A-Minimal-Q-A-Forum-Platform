const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const config = require('./deploy-config.json');

// Function to detect current environment
function detectEnvironment() {
    if (process.env.NODE_ENV === 'production') {
        if (process.env.RENDER) {
            return 'render';
        } else if (process.env.HEROKU) {
            return 'heroku';
        }
    }
    return 'local';
}

// Function to install dependencies
async function installDependencies(env) {
    try {
        const dependencies = config.environments[env].dependencies;
        
        for (const [name, dep] of Object.entries(dependencies)) {
            console.log(`Installing ${name}...`);
            
            // Download installer
            const installerPath = path.join(__dirname, `${name}.installer`);
            const installerUrl = dep.url;
            
            // Download using PowerShell
            execSync(`powershell -Command "Invoke-WebRequest -Uri '${installerUrl}' -OutFile '${installerPath}'"`);
            
            // Install based on installer type
            switch (dep.installer) {
                case 'msi':
                    execSync(`msiexec /i ${installerPath} /quiet`);
                    break;
                case 'exe':
                    execSync(`${installerPath} /S`);
                    break;
            }
            
            // Clean up
            fs.unlinkSync(installerPath);
        }
        
        return true;
    } catch (error) {
        console.error('Error installing dependencies:', error);
        return false;
    }
}

// Function to setup MongoDB
async function setupMongoDB(env) {
    try {
        if (env === 'local') {
            // Create data directory
            const dataDir = path.join('C:\\', 'data', 'db');
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }
            
            // Start MongoDB service
            execSync('net start MongoDB');
        } else {
            // For cloud environments, just check connection
            const dbUrl = config.environments[env].services.backend.env.MONGODB_URI;
            execSync(`mongosh "${dbUrl}" --eval "db.version()"`);
        }
        return true;
    } catch (error) {
        console.error('Error setting up MongoDB:', error);
        return false;
    }
}

// Function to build frontend
async function buildFrontend() {
    try {
        console.log('Building frontend...');
        execSync('cd client && npm install && npm run build');
        return true;
    } catch (error) {
        console.error('Error building frontend:', error);
        return false;
    }
}

// Function to start servers
async function startServers(env) {
    try {
        console.log('Starting servers...');
        
        // Start MongoDB if local
        if (env === 'local') {
            execSync('start "MongoDB" "C:\\Program Files\\MongoDB\\Server\\7.0\\bin\\mongod.exe" --dbpath="C:\\data\\db"');
        }
        
        // Start backend
        execSync('start "Backend Server" cmd /k "cd server && npm run dev"');
        
        // Start frontend
        execSync('start "Frontend Server" cmd /k "cd client && npm start"');
        
        return true;
    } catch (error) {
        console.error('Error starting servers:', error);
        return false;
    }
}

// Main deployment function
async function deploy() {
    try {
        // Detect environment
        const env = detectEnvironment();
        console.log(`Detected environment: ${env}`);
        
        // Get deployment steps for this environment
        const steps = config.deployment_steps[env];
        
        // Execute deployment steps
        for (const step of steps) {
            console.log(`Executing step: ${step}`);
            
            switch (step) {
                case 'install_dependencies':
                    await installDependencies(env);
                    break;
                case 'setup_mongodb':
                    await setupMongoDB(env);
                    break;
                case 'build_frontend':
                    await buildFrontend();
                    break;
                case 'start_servers':
                    await startServers(env);
                    break;
            }
        }
        
        console.log('Deployment complete!');
        
        // Show access information
        const ports = config.environments[env].ports;
        console.log(`\nAccess the application:`);
        console.log(`Frontend: http://localhost:${ports.frontend}`);
        console.log(`Backend: http://localhost:${ports.backend}`);
        console.log(`API: http://localhost:${ports.backend}/api`);
        
    } catch (error) {
        console.error('Deployment failed:', error);
        process.exit(1);
    }
}

// Run deployment
deploy();
