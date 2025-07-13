const jwt = require('jsonwebtoken');
const winston = require('winston');

const auth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error('Authentication required');
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add user to request
        req.user = decoded;
        
        // Log successful authentication
        winston.info('User authenticated', {
            userId: decoded.id,
            timestamp: new Date().toISOString()
        });
        
        next();
    } catch (error) {
        winston.error('Authentication error:', {
            message: error.message,
            timestamp: new Date().toISOString()
        });
        
        res.status(401).json({
            success: false,
            error: 'Please authenticate'
        });
    }
};

module.exports = auth;
