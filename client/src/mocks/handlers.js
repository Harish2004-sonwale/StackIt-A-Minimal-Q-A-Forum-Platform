import { rest } from 'msw';

export const handlers = [
    // Dashboard Stats
    rest.get('/api/admin/dashboard', (req, res, ctx) => {
        return res(
            ctx.json({
                stats: {
                    activeUsers: 150,
                    totalQuestions: 1200,
                    totalAnswers: 3500
                },
                topUsers: [
                    {
                        _id: '1',
                        username: 'user1',
                        questions: 50,
                        answers: 100,
                        activityScore: 1500
                    },
                    {
                        _id: '2',
                        username: 'user2',
                        questions: 45,
                        answers: 90,
                        activityScore: 1350
                    }
                ],
                recentActivity: [
                    {
                        _id: 'q1',
                        title: 'Test Question',
                        author: { username: 'user1' },
                        answers: [],
                        createdAt: new Date().toISOString()
                    }
                ]
            })
        );
    }),

    // User Management
    rest.get('/api/admin/users', (req, res, ctx) => {
        const { page = 1, limit = 10, sort = '-activityScore', search = '' } = req.url.searchParams;
        const users = [
            {
                _id: '1',
                username: 'admin',
                email: 'admin@example.com',
                role: 'admin',
                activityScore: 2000,
                createdAt: new Date().toISOString()
            },
            {
                _id: '2',
                username: 'user1',
                email: 'user1@example.com',
                role: 'user',
                activityScore: 1500,
                createdAt: new Date().toISOString()
            }
        ];

        return res(
            ctx.json({
                users: users.slice((page - 1) * limit, page * limit),
                totalUsers: users.length
            })
        );
    }),

    rest.put('/api/admin/users/:id/ban', (req, res, ctx) => {
        return res(ctx.json({ message: 'User banned successfully' }));
    }),

    rest.put('/api/admin/users/:id/unban', (req, res, ctx) => {
        return res(ctx.json({ message: 'User unbanned successfully' }));
    }),

    // Content Management
    rest.get('/api/admin/content', (req, res, ctx) => {
        const { page = 1, limit = 10, type = 'all', search = '' } = req.url.searchParams;
        const content = [
            {
                _id: 'q1',
                type: 'question',
                title: 'Test Question',
                author: { username: 'user1' },
                voteCount: 5,
                createdAt: new Date().toISOString(),
                flagged: false
            },
            {
                _id: 'a1',
                type: 'answer',
                content: 'Test Answer',
                author: { username: 'user2' },
                voteCount: 3,
                createdAt: new Date().toISOString(),
                flagged: true
            }
        ];

        return res(
            ctx.json({
                content: content.slice((page - 1) * limit, page * limit),
                totalContent: content.length
            })
        );
    }),

    rest.get('/api/admin/content/flagged', (req, res, ctx) => {
        return res(ctx.json({ count: 5 }));
    }),

    rest.delete('/api/admin/content/:id', (req, res, ctx) => {
        return res(ctx.json({ message: 'Content deleted successfully' }));
    })
];
