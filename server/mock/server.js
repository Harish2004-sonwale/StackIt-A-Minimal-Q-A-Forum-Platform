const express = require('express');
const mockData = require('./data');
const app = express();
const port = 5000;

app.use(express.json());

// Mock authentication middleware
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token === 'mock-token') {
        req.user = mockData.users[0];
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

// Mock routes
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const user = mockData.users.find(u => u.username === username);
    if (user && password === 'admin123') {
        res.json({ token: 'mock-token', user });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

app.get('/api/questions', (req, res) => {
    res.json(mockData.questions);
});

app.post('/api/questions', authMiddleware, (req, res) => {
    const question = {
        _id: mockData.questions.length + 1,
        title: req.body.title,
        content: req.body.content,
        user: req.user._id,
        tags: req.body.tags,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    mockData.questions.push(question);
    res.status(201).json(question);
});

app.get('/api/answers/:questionId', (req, res) => {
    const answers = mockData.answers.filter(a => a.question === req.params.questionId);
    res.json(answers);
});

app.post('/api/answers', authMiddleware, (req, res) => {
    const answer = {
        _id: mockData.answers.length + 1,
        content: req.body.content,
        question: req.body.questionId,
        user: req.user._id,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    mockData.answers.push(answer);
    res.status(201).json(answer);
});

app.listen(port, () => {
    console.log(`Mock server running at http://localhost:${port}`);
});
