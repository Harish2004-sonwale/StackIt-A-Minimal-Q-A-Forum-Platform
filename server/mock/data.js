const mockData = {
    users: [
        {
            _id: '1',
            username: 'admin',
            email: 'admin@example.com',
            password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: admin123
            role: 'admin',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            _id: '2',
            username: 'user1',
            email: 'user1@example.com',
            password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ],
    questions: [
        {
            _id: '1',
            title: 'How to run a Node.js application?',
            content: 'I have a Node.js application and I want to run it locally. What are the steps?',
            user: '2',
            tags: ['node.js', 'javascript'],
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ],
    answers: [
        {
            _id: '1',
            content: 'To run a Node.js application, first install Node.js from nodejs.org. Then navigate to your project directory and run `npm install` to install dependencies. Finally, use `node app.js` or `npm start` to run your application.',
            question: '1',
            user: '1',
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ]
};

module.exports = mockData;
