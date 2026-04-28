const argv = require('minimist')(process.argv.slice(2));
const components = argv.components !== true && argv.components;
const testPathPattern = argv.testPathPattern !== true && argv.testPathPattern;
const testNamePattern = argv.testNamePattern !== true && argv.testNamePattern;
const runCoverage = typeof argv.coverage !== 'undefined';
const runFirefox = typeof argv.firefox !== 'undefined';
const runChrome = typeof argv.chrome !== 'undefined';

const rootPath = __dirname;

module.exports = function (config) {
    const plugins = ['karma-webpack', 'karma-jasmine', 'karma-sourcemap-loader'];
    const launcher = [];

    if (runCoverage) {
        plugins.push('karma-coverage-istanbul-reporter');
    }

    if (runChrome) {
        plugins.push('karma-chrome-launcher');
        launcher.push('Chrome');
    }

    if (runFirefox) {
        plugins.push('karma-firefox-launcher');
        launcher.push('Firefox');
    }

    const tsConfig = {
        compilerOptions: {
            rootDir: rootPath,
            declaration: false,
            strict: false,
            downlevelIteration: true,
            transpileOnly: true, // Faster compilation - skip type checking
            paths: {
                '*': ['*', rootPath + '/packages/*'],
            },
        },
        transpileOnly: true, // Enable faster transpilation
    };

    const rules = runCoverage
        ? [
              {
                  test: /lib(\\|\/).*\.ts$/,
                  use: [
                      { loader: '@jsdevtools/coverage-istanbul-loader' },
                      {
                          loader: 'ts-loader',
                          options: tsConfig,
                      },
                  ],
              },
              {
                  test: /test(\\|\/).*\.ts$/,
                  loader: 'ts-loader',
                  options: tsConfig,
              },
          ]
        : [
              {
                  test: /\.ts$/,
                  loader: 'ts-loader',
                  options: tsConfig,
              },
          ];

    const settings = {
        basePath: '.',
        plugins,
        client: {
            components: components,
            testPathPattern: testPathPattern,
            testNamePattern: testNamePattern,
            clearContext: false,
            captureConsole: true,
            jasmine: {
                grep: testNamePattern || null,
            },
        },
        browsers: launcher,
        files: ['tools/karma.test.all.js'],
        frameworks: ['jasmine'],
        preprocessors: {
            'tools/karma.test.all.js': ['webpack', 'sourcemap'],
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        autoWatchBatchDelay: 300, // Batch file changes for better performance

        // to avoid DISCONNECTED messages
        browserDisconnectTimeout: 10000, // default 2000
        browserDisconnectTolerance: 1, // default 0
        browserNoActivityTimeout: 60000, //default 10000
        browserConsoleLogOptions: {
            level: 'log',
            format: '%b %T: %m',
            terminal: true,
        },

        singleRun: true,
        captureTimeout: 60000,

        webpack: {
            mode: 'development',
            devtool: 'inline-source-map', // More accurate source maps for debugging
            module: {
                rules,
            },
            resolve: {
                extensions: ['.ts', '.tsx', '.js'],
                modules: ['./packages', './node_modules'],
            },
            // Workaround karma-webpack issue https://github.com/ryanclark/karma-webpack/issues/493
            // Got this solution from https://github.com/ryanclark/karma-webpack/issues/493#issuecomment-780411348
            optimization: {
                splitChunks: false,
                removeAvailableModules: false, // Performance optimization
                removeEmptyChunks: false, // Performance optimization
            },
            // Add filesystem caching for better performance
            cache: {
                type: 'filesystem',
                cacheDirectory: require('path').join(rootPath, 'node_modules/.cache/webpack'),
            },
            stats: 'errors-warnings', // Reduce console output
        },

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,
    };

    if (runCoverage) {
        settings.reporters = ['coverage-istanbul'];
        settings.coverageIstanbulReporter = {
            reports: ['html', 'lcovonly', 'text-summary'],
            dir: './dist/deploy/coverage',
        };
    }

    config.set(settings);
};
