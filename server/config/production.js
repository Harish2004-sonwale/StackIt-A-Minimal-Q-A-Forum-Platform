const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const expressHealthCheck = require('express-health-check');
const expressStatusMonitor = require('express-status-monitor');
const winston = require('winston');
const { createLogger, format, transports } = winston;

module.exports = (app) => {
    // Security headers
    app.use(helmet());
    
    // Compression
    app.use(compression());
    
    // Logging
    const logger = createLogger({
        level: 'info',
        format: format.combine(
            format.timestamp(),
            format.json()
        ),
        transports: [
            new transports.File({ filename: 'error.log', level: 'error' }),
            new transports.File({ filename: 'combined.log' }),
            new transports.Console({
                format: format.combine(
                    format.colorize(),
                    format.simple()
                )
            })
        ]
    });

    // Request logging
    app.use(morgan('combined', { stream: logger.stream }));

    // Status monitoring
    app.use(expressStatusMonitor());

    // Health check
    app.use('/health', expressHealthCheck());

    // Error handling
    app.use((err, req, res, next) => {
        logger.error(err.stack);
        res.status(500).json({
            message: 'Something broke!',
            error: process.env.NODE_ENV === 'production' ? {} : err
        });
    });

    return app;
};
