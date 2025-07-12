require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stackit', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/auth');
const questionsRoutes = require('./routes/questions');
const votesRoutes = require('./routes/votes');
const answersRoutes = require('./routes/answers');
const notificationsRoutes = require('./routes/notifications');
const acceptAnswerRoutes = require('./routes/accept-answer');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/votes', votesRoutes);
app.use('/api/answers', answersRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/accept-answer', acceptAnswerRoutes);
app.use('/api/admin', adminRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
