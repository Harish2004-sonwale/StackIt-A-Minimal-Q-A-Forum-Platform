const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    
    // Log error for debugging
    console.error('Error:', {
        timestamp: new Date().toISOString(),
        status: statusCode,
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method,
        body: req.body,
        query: req.query
    });

    // Send appropriate error response
    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { error: err.stack })
    });
};

module.exports = errorHandler;
