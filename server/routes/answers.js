const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const Answer = require('../models/Answer');
const Question = require('../models/Question');

// POST /api/answers - Create a new answer
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { questionId, content } = req.body;
        const userId = req.user.userId;

        // Validate question existence
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Create new answer
        const answer = new Answer({
            questionId,
            author: userId,
            content
        });

        // Save answer
        const savedAnswer = await answer.save();

        // Add answer to question's answers array
        await Question.findByIdAndUpdate(
            questionId,
            { $push: { answers: savedAnswer._id } },
            { new: true }
        );

        // Add answer to user's answers array
        await User.findByIdAndUpdate(
            userId,
            { $push: { answers: savedAnswer._id } }
        );

        res.status(201).json({
            answer: {
                id: savedAnswer._id,
                content: savedAnswer.content,
                author: savedAnswer.author,
                createdAt: savedAnswer.createdAt,
                voteCount: savedAnswer.voteCount
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET /api/answers/question/:id - Get answers for a question
router.get('/question/:id', async (req, res) => {
    try {
        const answers = await Answer.find({ questionId: req.params.id })
            .populate('author', 'username')
            .sort({ createdAt: -1 });

        res.json({
            answers: answers.map(answer => ({
                _id: answer._id,
                content: answer.content,
                author: answer.author.username,
                createdAt: answer.createdAt,
                voteCount: answer.voteCount
            }))
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /api/answers/:id - Update an answer
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.id);
        if (!answer) {
            return res.status(404).json({ message: 'Answer not found' });
        }

        // Check if user is the author
        if (answer.author.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        answer.content = req.body.content;
        await answer.save();

        res.json({
            message: 'Answer updated',
            answer: {
                id: answer._id,
                content: answer.content,
                updatedAt: answer.updatedAt
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/answers/:id - Delete an answer
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.id);
        if (!answer) {
            return res.status(404).json({ message: 'Answer not found' });
        }

        // Check if user is the author or admin
        if (answer.author.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Remove answer from question's answers array
        await Question.findByIdAndUpdate(
            answer.questionId,
            { $pull: { answers: answer._id } }
        );

        // Remove answer from user's answers array
        await User.findByIdAndUpdate(
            answer.author,
            { $pull: { answers: answer._id } }
        );

        // Delete the answer
        await answer.deleteOne();

        res.json({ message: 'Answer deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
