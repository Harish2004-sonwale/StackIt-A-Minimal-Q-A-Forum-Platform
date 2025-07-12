const Notification = require('../models/Notification');

const createNotification = async ({
    userId,
    type,
    message,
    link,
    data = {}
}) => {
    try {
        const notification = new Notification({
            userId,
            type,
            message,
            link,
            data
        });

        await notification.save();
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

// Helper functions for common notification types
const notifyAnswer = async (question, answer, author) => {
    // Notify question author
    if (question.author.toString() !== author._id.toString()) {
        await createNotification({
            userId: question.author,
            type: 'answer',
            message: `${author.username} answered your question`,
            link: `/question/${question._id}`,
            data: {
                answerId: answer._id,
                questionId: question._id,
                authorId: author._id
            }
        });

        // Notify mentioned users
        const mentionedUsers = extractMentions(answer.content);
        for (const mentionedUser of mentionedUsers) {
            await createNotification({
                userId: mentionedUser._id,
                type: 'mention',
                message: `${author.username} mentioned you in an answer`,
                link: `/question/${question._id}`,
                data: {
                    answerId: answer._id,
                    questionId: question._id,
                    authorId: author._id
                }
            });
        }
    }
};

const notifyVote = async (answer, voter) => {
    await createNotification({
        userId: answer.author,
        type: 'vote',
        message: `${voter.username} voted on your answer`,
        link: `/question/${answer.questionId}`,
        data: {
            answerId: answer._id,
            questionId: answer.questionId,
            voterId: voter._id
        }
    });
};

// Helper function to extract @mentions from content
const extractMentions = (content) => {
    const mentions = content.match(/@([a-zA-Z0-9_]+)/g) || [];
    return mentions.map(mention => mention.slice(1)); // Remove @ symbol
};

module.exports = {
    createNotification,
    notifyAnswer,
    notifyVote
};
