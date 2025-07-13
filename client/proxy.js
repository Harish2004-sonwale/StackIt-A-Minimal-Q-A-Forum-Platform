const proxy = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(proxy('/api', {
        target: process.env.REACT_APP_API_URL || 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        logLevel: 'debug'
    }));
};
