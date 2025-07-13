require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const csrf = require('csurf');
const winston = require('winston');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');
const auth = require('./middleware/auth');

const app = express();

// Configure logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
        new winston.transports.Console()
    ]
});

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:", "http:"],
            connectSrc: ["'self'", "ws:", "wss:"],
            fontSrc: ["'self'", "data:", "https:", "http:"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'", "data:", "https:", "http:"],
            frameSrc: ["'self'"],
            frameAncestors: ["'self'"],
            formAction: ["'self'"],
            baseUri: ["'self'"],
            childSrc: ["'self'"],
            workerSrc: ["'self'"],
            manifestSrc: ["'self'"],
            reportUri: ["'self'"],
            upgradeInsecureRequests: [],
            blockAllMixedContent: []
        }
    }
}));

app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev', {
    stream: {
        write: (message) => logger.info(message.trim())
    }
}));

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS || 'http://localhost:3000';
const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token'],
    exposedHeaders: ['X-CSRF-Token']
};

app.use(cors(corsOptions));

// Rate limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5 // limit each IP to 5 login attempts per windowMs
});

const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20 // limit each IP to 20 admin requests per windowMs
});

// Apply rate limiting
app.use('/api', apiLimiter);
app.use('/api/auth/login', loginLimiter);
app.use('/api/admin/*', adminLimiter);

// Security middleware
app.use(xss());
app.use(mongoSanitize());

// CSRF protection
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);
app.use((req, res, next) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    next();
});

// MongoDB connection
let dbConnected = false;
const initDB = async () => {
    try {
        const connection = await connectDB();
        logger.info('Database connection initialized');
        dbConnected = true;
        return connection;
    } catch (error) {
        logger.error('Database initialization failed:', error);
        dbConnected = false;
        // Retry connection after 5 seconds
        setTimeout(initDB, 5000);
    }
};

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/questions', auth, require('./routes/questions'));
app.use('/api/answers', auth, require('./routes/answers'));
app.use('/api/users', auth, require('./routes/users'));
app.use('/api/admin', auth, require('./routes/admin'));
app.use('/api/health', require('./routes/health'));
app.use('/api/monitor', require('./routes/monitor'));

// Error handling
app.use(errorHandler);

// Start server
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
    logger.info(`Frontend served at http://localhost:${port}`);
    initDB();
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
        mongoose.connection.close(() => {
            logger.info('MongoDB connection closed');
            process.exit(0);
        });
    });
});

// Unhandled promise rejection
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Uncaught exception
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
