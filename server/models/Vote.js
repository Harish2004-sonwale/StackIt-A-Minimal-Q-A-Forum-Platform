const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    answerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Answer',
        required: true
    },
    value: {
        type: Number,
        enum: [1, -1],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for total votes on an answer
voteSchema.virtual('totalVotes', {
    ref: 'Vote',
    localField: 'answerId',
    foreignField: 'answerId',
    justOne: false,
    count: true
});

// Index to prevent duplicate votes
voteSchema.index({ userId: 1, answerId: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
