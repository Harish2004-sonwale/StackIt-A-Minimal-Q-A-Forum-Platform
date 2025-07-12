const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const Vote = require('../models/Vote');
const Answer = require('../models/Answer');

// POST /api/votes/answer/:id - Create/update vote
router.post('/answer/:id', authMiddleware, async (req, res) => {
    try {
        const { value } = req.body;
        const userId = req.user.userId;
        const answerId = req.params.id;

        // Validate input
        if (!value || ![1, -1].includes(value)) {
            return res.status(400).json({ message: 'Invalid vote value' });
        }

        // Check if user has already voted
        const existingVote = await Vote.findOne({ userId, answerId });

        if (existingVote) {
            // Update existing vote
            existingVote.value = value;
            await existingVote.save();
            
            // Update answer's vote count
            await Answer.findByIdAndUpdate(
                answerId,
                {
                    $inc: { voteCount: value - existingVote.value }
                }
            );
            
            return res.json({
                message: 'Vote updated',
                vote: existingVote
            });
        }

        // Create new vote
        const vote = new Vote({
            userId,
            answerId,
            value
        });

        await vote.save();

        // Update answer's vote count
        await Answer.findByIdAndUpdate(
            answerId,
            {
                $inc: { voteCount: value }
            }
        );

        res.status(201).json({
            message: 'Vote added',
            vote
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET /api/votes/answer/:id - Get vote count
router.get('/answer/:id', async (req, res) => {
    try {
        const answerId = req.params.id;
        const answer = await Answer.findById(answerId).select('voteCount');
        
        if (!answer) {
            return res.status(404).json({ message: 'Answer not found' });
        }

        res.json({
            total: answer.voteCount || 0
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
