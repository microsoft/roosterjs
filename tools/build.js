'use strict';

// Utilities
const ProgressBar = require('progress');

// Steps
const tslintStep = require('./buildTools/tslint');
const checkDependencyStep = require('./buildTools/checkDependency');
const cleanStep = require('./buildTools/clean');
const normalizeStep = require('./buildTools/normalize');
const buildAmdStep = require('./buildTools/buildAmd');
const buildMjsStep = require('./buildTools/buildMjs');
const buildCommonJsStep = require('./buildTools/buildCommonJs');
const pack = require('./buildTools/pack');
const dts = require('./buildTools/dts');
const buildDemoStep = require('./buildTools/buildDemo');
const buildDocumentStep = require('./buildTools/buildDocument');
const publishStep = require('./buildTools/publish');
const allTasks = [
    tslintStep,
    cleanStep,
    normalizeStep,
    checkDependencyStep,
    buildAmdStep,
    buildMjsStep,
    buildCommonJsStep,
    pack.commonJsDebug,
    pack.commonJsProduction,
    pack.amdDebug,
    pack.amdProduction,
    pack.commonJsDebugUi,
    pack.commonJsProductionUi,
    pack.amdDebugUi,
    pack.amdProductionUi,
    dts.dtsCommonJs,
    dts.dtsAmd,
    dts.dtsCommonJsUi,
    dts.dtsAmdUi,
    buildDemoStep,
    buildDocumentStep,
    publishStep,
];

// Commands
const commands = [
    'tslint', // Run tslint to check code style
    'checkdep', // Check circular dependency among files
    'clean', // Clean target folder
    'normalize', // Normalize package.json files
    'buildamd', // Build in AMD mode
    'buildmjs', // Build in ESM/MJS mode
    'buildcommonjs', // Build in CommonJs mode
    'pack', // Run webpack to generate standalone .js files
    'packprod', // Run webpack to generate standalone .js files in production mode
    'dts', // Generate type definition files (.d.ts)
    'builddemo', // Build the demo site
    'builddoc', // Build documents
    'publish', // Publish roosterjs packages to npm
];

class Runner {
    constructor(options) {
        this.tasks = allTasks.filter(task => task.enabled(options));
        this.options = options;
    }

    getUI() {
        var index = 0;
        return this.options.noProgressBar
            ? {
                  tick: (p1, p2) => {
                      index++;
                      var msg = (p1 || p2).message;

                      if (msg) {
                          console.log(`[Step ${index} of ${this.tasks.length}]: ${msg}`);
                      }
                  },
              }
            : new ProgressBar('[:bar] (:current/:total finished) :message  ', {
                  total: this.tasks.length,
                  width: 40,
                  complete: '#',
              });
    }

    run() {
        (async () => {
            console.log(`Start building roosterjs\n`);

            const bar = this.getUI();

            for (var i = 0; i < this.tasks.length; i++) {
                var task = this.tasks[i];

                if (i == 0) {
                    bar.tick(0, {
                        message: task.message,
                    });
                } else {
                    bar.tick({
                        message: task.message,
                    });
                }

                await task.callback(this.options);
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            bar.tick({
                message: '',
            });
            console.log('\nBuild completed successfully.');
        })().catch(e => {
            console.error('\n');
            console.error(e);
            process.exit(1);
        });
    }
}

function parseOptions(additionalParams) {
    var params = [...process.argv, ...additionalParams];
    var options = {};
    for (var i = 0; i < params.length; i++) {
        if (params[i] == '--token') {
            options.token = params[++i];
        } else if (params[i] == '--noProgressBar') {
            options.noProgressBar = true;
        } else {
            var index = commands.indexOf(params[i]);

            if (index >= 0) {
                options[commands[index]] = true;
            }
        }
    }
    return options;
}

// For debugging, put the build options below:
// e.g.
// let options = ['pack', 'packprod'];
const options = parseOptions([]);
new Runner(options).run();
