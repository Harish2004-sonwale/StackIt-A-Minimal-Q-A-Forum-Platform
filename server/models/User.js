const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }],
    banned: {
        type: Boolean,
        default: false
    },
    banReason: {
        type: String
    },
    banExpiresAt: {
        type: Date
    },
    lastLogin: {
        type: Date
    },
    activityScore: {
        type: Number,
        default: 0
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
userSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Virtual for calculating user activity score
userSchema.virtual('activityScore').get(function() {
    return this.activityScore + (this.questions.length * 10) + (this.answers.length * 5);
});

// Method to check if user is active
userSchema.methods.isActive = function() {
    return !this.banned && (!this.banExpiresAt || this.banExpiresAt > new Date());
};

// Method to ban user
userSchema.methods.ban = async function(reason, durationDays) {
    this.banned = true;
    this.banReason = reason;
    this.banExpiresAt = durationDays ? new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000) : null;
    await this.save();
};

// Method to unban user
userSchema.methods.unban = async function() {
    this.banned = false;
    this.banReason = null;
    this.banExpiresAt = null;
    await this.save();
};

module.exports = mongoose.model('User', userSchema);

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
