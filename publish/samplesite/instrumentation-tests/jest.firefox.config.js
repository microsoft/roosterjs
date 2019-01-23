/**
 * Keep in sync with jest.chrome.config.js
 */
module.exports = {
    globalSetup: './config/setup.firefox.js',
    globalTeardown: './config/teardown.js',
    testEnvironment: './config/puppeteer_environment.firefox.js',
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
