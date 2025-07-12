const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const Answer = require('../models/Answer');
const Question = require('../models/Question');

// PUT /api/answers/:id/accept - Toggle accepted answer
router.put('/:id/accept', authMiddleware, async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.id);
        if (!answer) {
            return res.status(404).json({ message: 'Answer not found' });
        }

        // Get the question
        const question = await Question.findById(answer.questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Check if user is the question author
        if (question.author.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Check if this answer is already accepted
        if (answer.isAccepted) {
            // Remove acceptance
            answer.isAccepted = false;
            await answer.save();
            
            // Remove any existing accepted answer from question
            await Question.findByIdAndUpdate(
                question._id,
                { $unset: { acceptedAnswer: 1 } }
            );
        } else {
            // First unaccept any existing accepted answer
            await Answer.updateMany(
                { questionId: question._id, isAccepted: true },
                { isAccepted: false }
            );

            // Mark this answer as accepted
            answer.isAccepted = true;
            await answer.save();

            // Update question with accepted answer
            await Question.findByIdAndUpdate(
                question._id,
                { acceptedAnswer: answer._id }
            );

            // Create notification for answer author
            if (answer.author.toString() !== req.user.userId) {
                await Notification.create({
                    userId: answer.author,
                    type: 'accept',
                    message: `${req.user.username} accepted your answer`,
                    link: `/question/${question._id}`,
                    data: {
                        answerId: answer._id,
                        questionId: question._id,
                        acceptorId: req.user.userId
                    }
                });
            }
        }

        res.json({
            message: 'Answer acceptance status updated',
            answer: {
                id: answer._id,
                isAccepted: answer.isAccepted,
                updatedAt: answer.updatedAt
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
