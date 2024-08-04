module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./jest.setup.ts'],
    collectCoverage: true,
    collectCoverageFrom: [
        "/**/*.ts",
        "!/**/*.d.ts"
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
};
