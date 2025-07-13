#!/bin/bash

# Check if MongoDB is running
check_mongodb() {
    echo "Checking MongoDB status..."
    if ! mongod --version &> /dev/null; then
        echo "MongoDB is not installed. Installing now..."
        # For Ubuntu/Debian
        sudo apt-get update
        sudo apt-get install -y mongodb
        
        # For CentOS/RHEL
        # sudo yum install -y mongodb-org
    fi
}

# Check Node.js version
check_node_version() {
    echo "Checking Node.js version..."
    REQUIRED_VERSION="v18"
    CURRENT_VERSION=$(node --version)
    
    if [[ "$CURRENT_VERSION" != $REQUIRED_VERSION* ]]; then
        echo "Node.js version mismatch. Installing correct version..."
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
        export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
        [ -s "$NVM_DIR/nvm.sh" ] && \nvm install 18
        \nvm use 18
    fi
}

# Install dependencies
install_dependencies() {
    echo "Installing dependencies..."
    
    # Install backend dependencies
    cd server && npm install
    
    # Install frontend dependencies
    cd ../client && npm install
}

# Start servers
start_servers() {
    echo "Starting servers..."
    
    # Start MongoDB
    sudo service mongod start
    
    # Start backend
    cd ../server
    npm run dev &
    
    # Start frontend
    cd ../client
    npm start &
}

# Main script
echo "Starting StackIt..."
check_mongodb
check_node_version
install_dependencies
start_servers

# Wait for servers to start
echo "Waiting for servers to start..."
sleep 5

# Check if servers are running
if curl -s http://localhost:5000/api/health &> /dev/null; then
    echo "Backend server is running"
else
    echo "Warning: Backend server failed to start"
fi

if curl -s http://localhost:3000 &> /dev/null; then
    echo "Frontend server is running"
else
    echo "Warning: Frontend server failed to start"
fi

# Open browser
echo "Opening browser..."
xdg-open http://localhost:3000 &
