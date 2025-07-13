import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
};

global.localStorage = localStorageMock;

// Mock window object
const mockWindow = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    location: {
        reload: jest.fn()
    }
};

global.window = mockWindow;

// Mock matchMedia
window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
}));

// Mock navigator
window.navigator = {
    userAgent: 'node.js'
};

// Mock document
const mockDocument = {
    createEvent: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    createElement: jest.fn(),
    querySelector: jest.fn(),
    getBoundingClientRect: jest.fn()
};

global.document = mockDocument;

// Mock IntersectionObserver
window.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
}));

// Mock ResizeObserver
window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
}));

// Mock fetch
window.fetch = jest.fn();

// Mock console
const originalConsole = global.console;

global.console = {
    ...originalConsole,
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
};

// Mock setTimeout and clearTimeout
const timers = {
    tasks: [],
    setTimeout: jest.fn((fn, delay) => {
        const id = timers.tasks.length;
        timers.tasks.push({ fn, delay });
        return id;
    }),
    clearTimeout: jest.fn((id) => {
        timers.tasks = timers.tasks.filter(task => task.id !== id);
    }),
    runAll: () => {
        timers.tasks.forEach(task => task.fn());
        timers.tasks = [];
    }
};

jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');
jest.spyOn(global, 'clearTimeout');
