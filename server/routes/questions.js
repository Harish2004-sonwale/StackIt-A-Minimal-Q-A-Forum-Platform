const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const sanitizeHtml = require('sanitize-html');
const { authMiddleware } = require('../middleware/authMiddleware');

// Sanitize HTML configuration
const sanitizeConfig = {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ['src', 'alt'],
        a: ['href', 'title', 'target']
    },
    allowedSchemes: ['https', 'http'],
    allowedSchemesByTag: {
        img: ['https', 'http']
    }
};

// POST /api/questions - Create a new question
router.post('/', authMiddleware, async (req, res) => {
    try {
        // Sanitize HTML content
        const sanitizedDescription = sanitizeHtml(req.body.description, sanitizeConfig);

        // Create new question
        const question = new Question({
            title: req.body.title,
            description: sanitizedDescription,
            tags: req.body.tags,
            author: req.user.userId
        });

        // Save question
        const savedQuestion = await question.save();

        // Add question ID to user's questions array
        await User.findByIdAndUpdate(
            req.user.userId,
            { $push: { questions: savedQuestion._id } }
        );

        res.status(201).json({
            question: {
                id: savedQuestion._id,
                title: savedQuestion.title,
                description: savedQuestion.description,
                tags: savedQuestion.tags,
                createdAt: savedQuestion.createdAt
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
