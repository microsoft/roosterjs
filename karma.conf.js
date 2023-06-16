const argv = require('minimist')(process.argv.slice(2));
const components = argv.components !== true && argv.components;
const runCoverage = typeof argv.coverage !== 'undefined';
const runFirefox = typeof argv.firefox !== 'undefined';
const runChrome = typeof argv.chrome !== 'undefined';

const testEntries = {
    'Original RoosterJs': 'tools/karma.test.roosterjs.js',
    UI: 'tools/karma.test.ui.js',
    'Content Model': 'tools/karma.test.contentmodel.js',
    All: 'tools/karma.test.all.js',
};
const currentEntry =
    typeof argv.contentmodel !== 'undefined'
        ? 'Content Model'
        : typeof argv.roosterjs !== 'undefined'
        ? 'Original RoosterJs'
        : typeof argv.ui !== 'undefined'
        ? 'UI'
        : 'All';
const currentFile = testEntries[currentEntry];
const allPreprocessors = Object.keys(testEntries).reduce((value, entry) => {
    value[testEntries[entry]] = ['webpack', 'sourcemap'];
    return value;
}, {});

const path = require('path');

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
                  use: [
                      { loader: '@jsdevtools/coverage-istanbul-loader' },
                      { loader: 'ts-loader' },
                  ],
              },
              {
                  test: /test(\\|\/).*\.ts$/,
                  loader: 'ts-loader',
                  options: {
                      compilerOptions: {
                          strict: false,
                      },
                  },
              },
          ]
        : [
              {
                  test: /\.ts$/,
                  loader: 'ts-loader',
                  options: {
                      compilerOptions: {
                          strict: false,
                      },
                  },
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
        files: [currentFile],
        frameworks: ['jasmine'],
        preprocessors: allPreprocessors,
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,

        // to avoid DISCONNECTED messages
        browserDisconnectTimeout: 10000, // default 2000
        browserDisconnectTolerance: 1, // default 0
        browserNoActivityTimeout: 60000, //default 10000

        singleRun: true,
        captureTimeout: 60000,

        webpack: {
            mode: 'development',
            module: {
                rules,
            },
            resolve: {
                extensions: ['.ts', '.js'],
                modules: ['./packages', './node_modules'],
            },
            output: {
                path: path.join(__dirname, 'dist/karma'),
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

    console.log('Run ' + currentEntry + ' test cases...');

    config.set(settings);
};
