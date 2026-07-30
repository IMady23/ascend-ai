export default {
    testEnvironment: 'node',
    roots: ['<rootDir>/tests'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/tests/fixtures/setup.ts'],
    testMatch: [
        '**/tests/**/*.test.ts'
    ],
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/tests/fixtures/'
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    }
};
