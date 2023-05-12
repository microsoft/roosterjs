const argv = require('minimist')(process.argv.slice(2));
const components = argv.components !== true && argv.components;
const runCoverage = typeof argv.coverage !== 'undefined';
const runFirefox = typeof argv.firefox !== 'undefined';
const runChrome = typeof argv.chrome !== 'undefined';

module.exports = function (config) {
    const plugins = [
        'karma-webpack',
        'karma-phantomjs-launcher',
        'karma-jasmine',
        'karma-sourcemap-loader',
    ];
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

    const rules = runCoverage
        ? [
              {
                  test: /lib(\\|\/).*\.ts$/,
                  loader: ['@jsdevtools/coverage-istanbul-loader', 'ts-loader'],
              },
              {
                  test: /test(\\|\/).*\.ts$/,
                  loader: 'ts-loader',
              },
          ]
        : [
              {
                  test: /\.ts$/,
                  loader: 'ts-loader',
              },
          ];

    const settings = {
        basePath: '.',
        plugins,
        client: {
            components: components,
            clearContext: false,
        },
        browsers: launcher,
        files: ['karma.tests.js'],
        frameworks: ['jasmine'],
        preprocessors: {
            'karma.tests.js': ['webpack', 'sourcemap'],
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,

        // to avoid DISCONNECTED messages
        browserDisconnectTimeout: 100000, // default 2000
        browserDisconnectTolerance: 1, // default 0
        browserNoActivityTimeout: 600000, //default 10000

        singleRun: true,
        captureTimeout: 60000,

        webpack: {
            devtool: 'inline-source-map',
            mode: 'development',
            module: {
                rules,
            },
            resolve: {
                extensions: ['.ts', '.js'],
                modules: ['./packages', './node_modules'],
            },
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
