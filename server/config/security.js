const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const csrf = require('csurf');
const compression = require('compression');
const expressSlowDown = require('express-slow-down');

module.exports = (app) => {
    // Rate limiting
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        message: 'Too many requests from this IP, please try again later.'
    });

    // Slow down after 100 requests
    const speedLimiter = expressSlowDown({
        windowMs: 15 * 60 * 1000, // 15 minutes
        delayAfter: 100, // allow 100 requests without delay
        delayMs: 500 // add 500ms of delay per request
    });

    // Security headers
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                styleSrc: ["'self'", "'unsafe-inline'"]
            }
        },
        crossOriginEmbedderPolicy: false
    }));

    // Prevent XSS attacks
    app.use(xss());

    // Prevent MongoDB injection
    app.use(mongoSanitize());

    // Prevent parameter pollution
    app.use(hpp());

    // Enable CORS with restrictions
    app.use(cors({
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }));

    // Enable CSRF protection
    const csrfProtection = csrf({ cookie: true });
    app.use(csrfProtection);

    // Enable compression
    app.use(compression());

    // Apply rate limiting
    app.use('/api/auth', limiter);
    app.use('/api/questions', limiter);
    app.use('/api/answers', limiter);
    app.use('/api/votes', limiter);

    // Apply speed limiting
    app.use('/api/auth', speedLimiter);
    app.use('/api/questions', speedLimiter);
    app.use('/api/answers', speedLimiter);
    app.use('/api/votes', speedLimiter);

    // Add security headers
    app.use((req, res, next) => {
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        next();
    });

    // Add security logging
    app.use((req, res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
        console.log(`IP: ${req.ip}`);
        console.log(`User-Agent: ${req.headers['user-agent']}`);
        next();
    });
};
