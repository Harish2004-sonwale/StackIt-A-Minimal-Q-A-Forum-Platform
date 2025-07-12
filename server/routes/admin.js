const express = require('express');
const router = express.Router();
const { adminMiddleware, superAdminMiddleware } = require('../middleware/adminMiddleware');
const User = require('../models/User');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const mongoose = require('mongoose');

// GET /api/admin/content/flagged - Get count of flagged content
router.get('/content/flagged', adminMiddleware, async (req, res) => {
    try {
        const [flaggedQuestions, flaggedAnswers] = await Promise.all([
            Question.countDocuments({ flagged: true }),
            Answer.countDocuments({ flagged: true })
        ]);

        res.json({
            count: flaggedQuestions + flaggedAnswers
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/admin/dashboard - Get admin dashboard stats
router.get('/dashboard', adminMiddleware, async (req, res) => {
    try {
        const [users, questions, answers] = await Promise.all([
            User.countDocuments({ banned: false }),
            Question.countDocuments(),
            Answer.countDocuments()
        ]);

        // Get top users by activity
        const topUsers = await User.find()
            .select('username activityScore questions answers')
            .sort({ activityScore: -1 })
            .limit(5);

        // Get recent activity
        const recentActivity = await Question.find()
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            stats: {
                activeUsers: users,
                totalQuestions: questions,
                totalAnswers: answers
            },
            topUsers,
            recentActivity
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/admin/users - List all users with filters
router.get('/users', adminMiddleware, async (req, res) => {
    try {
        const { page = 1, limit = 20, sort = '-activityScore', search } = req.query;
        const skip = (page - 1) * limit;

        const query = search ? {
            $or: [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        } : {};

        const [users, total] = await Promise.all([
            User.find(query)
                .select('username email role banned activityScore questions answers')
                .sort(sort)
                .skip(skip)
                .limit(limit),
            User.countDocuments(query)
        ]);

        res.json({
            users,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            totalUsers: total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/admin/users/:id/ban - Ban/unban user
router.put('/users/:id/ban', adminMiddleware, async (req, res) => {
    try {
        const { reason, durationDays } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'admin' && req.user.role !== 'super_admin') {
            return res.status(403).json({ message: 'Cannot ban admin users' });
        }

        await user.ban(reason, durationDays);
        res.json({ message: 'User banned successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/admin/users/:id/unban - Unban user
router.put('/users/:id/unban', adminMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.unban();
        res.json({ message: 'User unbanned successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/admin/content - List content with filters
router.get('/content', adminMiddleware, async (req, res) => {
    try {
        const { page = 1, limit = 20, type = 'all', status = 'all', search } = req.query;
        const skip = (page - 1) * limit;

        let query = {};
        if (search) {
            query = {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { content: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const [content, total] = await Promise.all([
            Question.find(query)
                .select('title description tags author createdAt')
                .populate('author', 'username')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Question.countDocuments(query)
        ]);

        res.json({
            content,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            totalContent: total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/admin/content/:id - Delete content
router.delete('/content/:id', superAdminMiddleware, async (req, res) => {
    try {
        const content = await Question.findById(req.params.id);
        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }

        // Delete associated answers
        await Answer.deleteMany({ questionId: content._id });

        // Delete question
        await content.deleteOne();

        res.json({ message: 'Content deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/admin/reports - Generate reports
router.get('/reports', superAdminMiddleware, async (req, res) => {
    try {
        const { type = 'activity', period = 'month' } = req.query;
        const now = new Date();
        let startDate;

        switch (period) {
            case 'day':
                startDate = new Date(now.setDate(now.getDate() - 1));
                break;
            case 'week':
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case 'month':
                startDate = new Date(now.setMonth(now.getMonth() - 1));
                break;
            case 'year':
                startDate = new Date(now.setFullYear(now.getFullYear() - 1));
                break;
            default:
                startDate = new Date(now.setDate(now.getDate() - 7));
        }

        let query = { createdAt: { $gte: startDate } };
        
        const [questions, answers, users] = await Promise.all([
            Question.find(query).countDocuments(),
            Answer.find(query).countDocuments(),
            User.find(query).countDocuments()
        ]);

        res.json({
            period,
            stats: {
                questions,
                answers,
                users
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/admin/reports/export - Export reports to CSV
router.post('/reports/export', superAdminMiddleware, async (req, res) => {
    try {
        const { type = 'activity', period = 'month' } = req.body;
        const now = new Date();
        let startDate;

        switch (period) {
            case 'day':
                startDate = new Date(now.setDate(now.getDate() - 1));
                break;
            case 'week':
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case 'month':
                startDate = new Date(now.setMonth(now.getMonth() - 1));
                break;
            case 'year':
                startDate = new Date(now.setFullYear(now.getFullYear() - 1));
                break;
            default:
                startDate = new Date(now.setDate(now.getDate() - 7));
        }

        let query = { createdAt: { $gte: startDate } };
        
        const [questions, answers, users] = await Promise.all([
            Question.find(query).select('title author createdAt'),
            Answer.find(query).select('content author createdAt'),
            User.find(query).select('username email role createdAt')
        ]);

        // Format data for CSV
        const csvData = [
            ['Type', 'Title/Content', 'Author', 'Created At']
        ];

        questions.forEach(q => {
            csvData.push(['Question', q.title, q.author.username, q.createdAt]);
        });

        answers.forEach(a => {
            csvData.push(['Answer', a.content.substring(0, 100), a.author.username, a.createdAt]);
        });

        users.forEach(u => {
            csvData.push(['User', u.username, u.email, u.role, u.createdAt]);
        });

        // Convert to CSV string
        const csvString = csvData.map(row => row.join(',')).join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=stackit-report.csv');
        res.send(csvString);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
