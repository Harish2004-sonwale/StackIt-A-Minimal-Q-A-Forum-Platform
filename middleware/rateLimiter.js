const rateLimit = require('express-rate-limit');
const winston = require('winston');

// API Rate Limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: 'Too many requests from this IP, please try again later'
    },
    skip: (req) => {
        // Skip rate limiting for health check endpoint
        return req.path === '/api/health';
    }
});

// Login Rate Limiter
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: 'Too many login attempts. Please try again later'
    },
    skip: (req) => {
        // Skip rate limiting for health check endpoint
        return req.path === '/api/health';
    }
});

// Admin Rate Limiter
const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 admin requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: 'Too many admin requests. Please try again later'
    },
    skip: (req) => {
        // Skip rate limiting for health check endpoint
        return req.path === '/api/health';
    }
});

// Log rate limit events
const logRateLimit = (req, res, next) => {
    winston.info('Rate limit check', {
        path: req.path,
        ip: req.ip,
        timestamp: new Date().toISOString()
    });
    next();
};

module.exports = {
    apiLimiter,
    loginLimiter,
    adminLimiter,
    logRateLimit
};
