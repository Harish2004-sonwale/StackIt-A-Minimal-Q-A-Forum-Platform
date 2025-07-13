module.exports = {
    rootDir: '.',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/client/src/$1',
        '^@components/(.*)$': '<rootDir>/client/src/components/$1',
        '^@utils/(.*)$': '<rootDir>/client/src/utils/$1',
        '^@store/(.*)$': '<rootDir>/client/src/store/$1',
        '^@api/(.*)$': '<rootDir>/client/src/api/$1',
        '^@middleware/(.*)$': '<rootDir>/server/middleware/$1',
        '^@routes/(.*)$': '<rootDir>/server/routes/$1',
        '^@models/(.*)$': '<rootDir>/server/models/$1',
        '^@services/(.*)$': '<rootDir>/server/services/$1'
    },
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
        '^.+\\.(css|less|scss|sass)$': 'jest-transform-css'
    },
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: ['node_modules', '.next', 'jest.config.js'],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    }
};
