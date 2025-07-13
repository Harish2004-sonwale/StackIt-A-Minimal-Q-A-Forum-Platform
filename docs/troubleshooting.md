# Troubleshooting Guide

This guide provides solutions to common issues you might encounter while running StackIt.

## Common Issues and Solutions

### 1. MongoDB Connection Issues
- **Error**: `MongoDB connection failed`
- **Solution**: 
  1. Ensure MongoDB is running
  2. Check MongoDB URI in `.env`
  3. Verify MongoDB version compatibility
  4. Try:
     ```bash
     # Check MongoDB status
     sudo service mongod status
     
     # Start MongoDB
     sudo service mongod start
     ```

### 2. Node.js Version Issues
- **Error**: `Node.js version mismatch`
- **Solution**: 
  1. Check required Node.js version in `package.json`
  2. Install correct version using nvm:
     ```bash
     # Install nvm
     curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
     
     # Install specific Node.js version
     nvm install 18
     nvm use 18
     ```

### 3. Port Conflicts
- **Error**: `Port already in use`
- **Solution**: 
  1. Find process using the port:
     ```bash
     # Windows
     netstat -ano | findstr :5000
     
     # Kill process
     taskkill /PID <PID> /F
     ```
  2. Change port in `.env` file

### 4. Environment Variables
- **Error**: `Missing environment variables`
- **Solution**: 
  1. Copy `.env.example` to `.env`
  2. Fill in required values:
     ```bash
     cp client/.env.example client/.env
     cp server/.env.example server/.env
     ```
  3. Verify all required variables are set

### 5. CORS Issues
- **Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`
- **Solution**: 
  1. Check CORS configuration in server
  2. Verify `CLIENT_URL` in `.env`
  3. Add domain to allowed origins

### 6. Authentication Issues
- **Error**: `Unauthorized access`
- **Solution**: 
  1. Check JWT secret in `.env`
  2. Clear browser cookies
  3. Re-login
  4. Verify session timeout

### 7. Build Issues
- **Error**: `Build failed`
- **Solution**: 
  1. Clear npm cache:
     ```bash
     npm cache clean --force
     ```
  2. Remove node_modules:
     ```bash
     rm -rf node_modules
     npm install
     ```
  3. Clear build cache:
     ```bash
     npm run clean
     npm run build
     ```

## Common Commands

### Development
```bash
# Start backend
npm run dev

# Start frontend
npm start

# Build frontend
npm run build

# Run tests
npm test
```

### Production
```bash
# Build and start production
npm run build
npm start

# Start with PM2
pm2 start ecosystem.config.js
pm2 logs
```

### Database
```bash
# Start MongoDB
mongod

# Connect to MongoDB
mongo

# Import data
mongoimport --db stackit --collection questions --file questions.json
```

## Error Codes

### HTTP Status Codes
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

### MongoDB Error Codes
- 11000: Duplicate key error
- 10107: Connection refused
- 13: Permission denied

## Debugging Tips

1. Check logs:
   ```bash
   # Server logs
   npm run dev -- --debug
   
   # MongoDB logs
   tail -f /var/log/mongodb/mongod.log
   ```

2. Use development tools:
   - Browser DevTools (F12)
   - Network tab
   - Console tab

3. Check environment variables:
   ```bash
   echo $MONGODB_URI
   echo $JWT_SECRET
   ```

4. Verify dependencies:
   ```bash
   npm list
   npm outdated
   ```

## Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Express Documentation](https://expressjs.com/)

If you encounter any issues not listed here, please:
1. Check the logs
2. Search existing issues
3. Create a new issue with detailed information
4. Include error messages and steps to reproduce
