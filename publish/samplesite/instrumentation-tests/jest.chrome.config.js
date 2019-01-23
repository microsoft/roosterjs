/**
 * Keep in sync with jest.firefox.config.js
 */
module.exports = {
    globalSetup: './config/setup.chrome.js',
    globalTeardown: './config/teardown.js',
    testEnvironment: './config/puppeteer_environment.chrome.js',
    testMatch: [
        "**/__instrumentation-tests__/**/*.test.ts?(x)",
    ],
    transform: {
        'ts(x)?$': 'ts-jest',
    },
    moduleFileExtensions: ["js", "jsx", "json", "ts", "tsx"],
    globals: {
        'ts-jest': {
            tsConfig: './tsconfig.json'
        }
    }
};
