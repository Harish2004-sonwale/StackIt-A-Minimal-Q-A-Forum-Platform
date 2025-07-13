const mongoose = require('mongoose');
const winston = require('winston');

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/stackit';
        
        // Configure MongoDB connection options
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            keepAlive: true,
            maxPoolSize: 100,
            wtimeoutMS: 2500,
            retryWrites: true,
            retryReads: true
        };

        // Connect with retry
        let connectionAttempts = 0;
        const maxAttempts = 10;
        
        while (connectionAttempts < maxAttempts) {
            try {
                await mongoose.connect(uri, options);
                winston.info('MongoDB connected successfully');
                return mongoose.connection;
            } catch (err) {
                connectionAttempts++;
                winston.error(`MongoDB connection attempt ${connectionAttempts} failed:`, err);
                
                if (connectionAttempts >= maxAttempts) {
                    throw new Error('Failed to connect to MongoDB after multiple attempts');
                }
                
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
    } catch (error) {
        winston.error('MongoDB connection error:', error);
        throw error;
    }
};

// Export the connection function
module.exports = connectDB;
