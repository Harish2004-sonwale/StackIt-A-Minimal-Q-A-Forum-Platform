import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { server } from '../integration/server';

// Mock auth context
jest.mock('../contexts/AuthContext', () => ({
    useAuth: () => ({
        user: {
            id: '1',
            username: 'testuser',
            email: 'user@example.com'
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
    question: {
        question: {
            _id: 'q1',
            title: 'Test Question',
            description: '<p>This is a test question.</p>',
            author: {
                _id: '1',
                username: 'user1'
            },
            tags: ['javascript', 'react'],
            answers: [],
            voteCount: 5,
            createdAt: new Date().toISOString()
        }
    },
    answers: {
        answers: [
            {
                _id: 'a1',
                content: '<p>This is a test answer.</p>',
                author: {
                    _id: '1',
                    username: 'user1'
                },
                voteCount: 3,
                createdAt: new Date().toISOString()
            }
        ]
    }
};

// Mock API server
server.use(
    rest.get('/api/questions/:id', (req, res, ctx) => {
        return res(ctx.json(mockResponses.question));
    }),
    rest.get('/api/answers/:id', (req, res, ctx) => {
        return res(ctx.json(mockResponses.answers));
    }),
    rest.post('/api/answers', (req, res, ctx) => {
        return res(ctx.json({ message: 'Answer posted successfully' }));
    }),
    rest.put('/api/votes/:id', (req, res, ctx) => {
        return res(ctx.json({ message: 'Vote updated successfully' }));
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

// Global setup for all tests
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests
afterEach(() => {
    server.resetHandlers();
    jest.clearAllMocks();
});

// Clean up after the tests are finished
afterAll(() => server.close());

export * from '@testing-library/react';
export { render };
