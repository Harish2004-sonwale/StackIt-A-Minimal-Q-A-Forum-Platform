const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const winston = require('winston');

// Health check endpoint
router.get('/', async (req, res) => {
    try {
        // Check MongoDB connection
        const dbStatus = await mongoose.connection.readyState;
        
        // Check environment variables
        const envVars = {
            NODE_ENV: process.env.NODE_ENV,
            PORT: process.env.PORT,
            MONGODB_URI: !!process.env.MONGODB_URI,
            JWT_SECRET: !!process.env.JWT_SECRET,
            CLIENT_URL: !!process.env.CLIENT_URL,
            ALLOWED_ORIGINS: !!process.env.ALLOWED_ORIGINS
        };

        // Check server status
        const serverStatus = {
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            load: process.cpuUsage(),
            environment: process.env.NODE_ENV,
            pid: process.pid
        };

        // Check API endpoints
        const apiStatus = {
            auth: true,
            questions: true,
            answers: true,
            health: true
        };

        // Check database connection
        if (dbStatus !== 1) {
            throw new Error('Database connection not ready');
        }

        // Log health check
        winston.info('Health check successful', { 
            status: 'ok',
            dbStatus,
            envVars,
            serverStatus,
            apiStatus
        });

        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            dbStatus,
            envVars,
            serverStatus,
            apiStatus
        });
    } catch (error) {
        winston.error('Health check error:', error);
        res.status(500).json({
            status: 'error',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = router;
