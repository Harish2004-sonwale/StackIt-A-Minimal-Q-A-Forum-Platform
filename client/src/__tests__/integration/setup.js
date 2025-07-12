import { render as rtlRender } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { server } from './server';

// Mock auth context
jest.mock('../contexts/AuthContext', () => ({
    useAuth: () => ({
        user: {
            role: 'admin',
            username: 'testadmin',
            email: 'admin@example.com'
        },
        logout: jest.fn()
    }),
    AuthProvider: ({ children }) => <>{children}</>
}));

// Mock axios
jest.mock('axios', () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
}));

// Mock API responses
const mockResponses = {
    dashboard: {
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
    },
    users: {
        users: [
            {
                _id: '1',
                username: 'user1',
                email: 'user1@example.com',
                role: 'user',
                activityScore: 1500,
                createdAt: new Date().toISOString()
            }
        ],
        totalUsers: 1
    },
    content: {
        content: [
            {
                _id: 'q1',
                type: 'question',
                title: 'Test Question',
                content: 'This is a test question content.',
                author: {
                    _id: 'u1',
                    username: 'user1'
                },
                voteCount: 5,
                createdAt: new Date().toISOString(),
                flagged: false
            }
        ],
        totalContent: 1
    }
};

// Mock API server
server.use(
    rest.get('/api/admin/dashboard', (req, res, ctx) => {
        return res(ctx.json(mockResponses.dashboard));
    }),
    rest.get('/api/admin/users', (req, res, ctx) => {
        return res(ctx.json(mockResponses.users));
    }),
    rest.get('/api/admin/content', (req, res, ctx) => {
        return res(ctx.json(mockResponses.content));
    }),
    rest.put('/api/admin/users/:id/ban', (req, res, ctx) => {
        return res(ctx.json({ message: 'User banned successfully' }));
    }),
    rest.delete('/api/admin/content/:id', (req, res, ctx) => {
        return res(ctx.json({ message: 'Content deleted successfully' }));
    })
);

// Custom render function
function render(
    ui,
    {
        route = '/',
        ...renderOptions
    } = {}
) {
    function Wrapper({ children }) {
        return (
            <MemoryRouter initialEntries={[route]}>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </MemoryRouter>
        );
    }

    return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

export * from '@testing-library/react';
export { render };

// Establish API mocking before all tests
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests
afterEach(() => {
    server.resetHandlers();
    jest.clearAllMocks();
});

// Clean up after the tests are finished
afterAll(() => server.close());
