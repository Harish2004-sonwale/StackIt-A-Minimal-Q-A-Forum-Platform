FROM node:18-alpine as builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build backend
RUN npm run build

# Build frontend
WORKDIR /app/client
RUN npm install && npm run build

# Production image
FROM node:18-alpine

WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/client/build ./client/build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server.js ./

# Install production dependencies
RUN npm install --production

# Add pm2 for process management
RUN npm install -g pm2

# Add security headers
RUN npm install helmet compression

# Add logging
RUN npm install morgan winston

# Add monitoring
RUN npm install express-status-monitor

# Add backup utilities
RUN npm install mongodump

# Add health check endpoint
RUN npm install express-health-check

EXPOSE 5000

CMD ["pm2-runtime", "server.js"]
