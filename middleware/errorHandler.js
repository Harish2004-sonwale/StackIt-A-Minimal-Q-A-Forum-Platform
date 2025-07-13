const winston = require('winston');

const errorHandler = (err, req, res, next) => {
    // Log the error
    winston.error('Error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    // Handle specific error types
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            error: 'Validation error',
            details: err.errors
        });
    }

    if (err.name === 'MongoError') {
        return res.status(500).json({
            success: false,
            error: 'Database error',
            details: err.message
        });
    }

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            error: 'Invalid token',
            details: 'Please login again'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            error: 'Token expired',
            details: 'Please login again'
        });
    }

    // Handle general errors
    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'Internal Server Error',
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = errorHandler;
