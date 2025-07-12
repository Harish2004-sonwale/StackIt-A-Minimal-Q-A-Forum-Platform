const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    voteCount: {
        type: Number,
        default: 0
    },
    isAccepted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Update updatedAt timestamp on save
answerSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Virtual for getting the author's username
answerSchema.virtual('authorName', {
    ref: 'User',
    localField: 'author',
    foreignField: '_id',
    justOne: true,
    select: 'username'
});

// Index for question and accepted answer
answerSchema.index({ questionId: 1, isAccepted: 1 });

module.exports = mongoose.model('Answer', answerSchema);

// Update updatedAt timestamp on save
answerSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Virtual for getting the author's username
answerSchema.virtual('authorName', {
    ref: 'User',
    localField: 'author',
    foreignField: '_id',
    justOne: true,
    select: 'username'
});

module.exports = mongoose.model('Answer', answerSchema);
