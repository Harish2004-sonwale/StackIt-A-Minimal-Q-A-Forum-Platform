const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

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
            CLIENT_URL: !!process.env.CLIENT_URL
        };

        // Check server status
        const serverStatus = {
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            load: process.cpuUsage()
        };

        // Check API endpoints
        const apiStatus = {
            auth: true, // Add actual checks for auth endpoints
            questions: true, // Add actual checks for questions endpoints
            answers: true // Add actual checks for answers endpoints
        };

        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            dbStatus,
            envVars,
            serverStatus,
            apiStatus
        });
    } catch (error) {
        console.error('Health check error:', error);
        res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
});

module.exports = router;
