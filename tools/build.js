var exec = require('child_process').execSync;
var fs = require('fs');
var path = require('path');
var ProgressBar = require('progress');
var webpack = require('webpack');
var glob = require('glob');
var toposort = require('toposort');
var assign = require('object-assign');
var dts = require('./dts');
var mkdirp = require('mkdirp');

// Paths
var rootPath = path.join(__dirname, '..');
var packagesPath = path.join(rootPath, 'packages');
var nodeModulesPath = path.join(rootPath, 'node_modules');
var typescriptPath = path.join(nodeModulesPath, 'typescript/lib/tsc.js');
var distPath = path.join(rootPath, 'dist');
var roosterJsDistPath = path.join(distPath, 'roosterjs/dist');

// Packages
var packages = collectPackages(packagesPath);
var mainPackageJson = JSON.parse(fs.readFileSync(path.join(rootPath, 'package.json')));
var version = mainPackageJson.version;
var license = fs.readFileSync(path.join(rootPath, 'LICENSE')).toString();

// Commands
var commands = [
    'checkdep', // Check circular dependency among files
    'clean', // Clean target folder
    'copysample', // Copy sample code to target folder
    'dts', // Generate type definitioin files (.d.ts)
    'tslint', // Run tslint to check code style
    'normalize', // Normalize package.json files
    'pack', // Run webpack to generate standalone .js files
    'packprod', // Run webpack to generate standalone .js files in production mode
    'builddemo', // Build the demo site
    'buildcommonjs', // Build in CommonJs mode
    'buildamd', // Build in AMD mode
    'publish', // Publish roosterjs packages to npm
    'builddoc', // Build documents
];

function readPackageJson(package) {
    var packageJsonFilePath = path.join(packagesPath, package, 'package.json');
    var content = fs.readFileSync(packageJsonFilePath);
    var packageJson = JSON.parse(content);
    return packageJson;
}

function collectPackages() {
    var packagePaths = glob.sync(
        path.relative(rootPath, path.join(packagesPath, '**', 'package.json')),
        { nocase: true }
    );

    var packageNames = packagePaths.map(path =>
        path.replace('packages/', '').replace('/package.json', '')
    );
    var graph = [];

    packagePaths.forEach(path => {
        var packageJson = JSON.parse(fs.readFileSync(path).toString());
        var packageName = packageJson.name;
        var depsMap = {};

        if ('dependencies' in packageJson) {
            assign(depsMap, packageJson.dependencies);
        }

        if ('devDependencies' in packageJson) {
            assign(depsMap, packageJson.devDependencies);
        }

        var deps = Object.keys(depsMap).filter(d => packageNames.indexOf(d) >= 0);

        deps.forEach(child => {
            graph.push([child, packageName]);
        });

        if (deps.length == 0) {
            graph.push([packageName]);
        }
    });

    return toposort(graph).filter(n => n);
}

async function clean() {
    var rimraf = require('rimraf');
    await new Promise((resolve, reject) => {
        rimraf(distPath, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function checkDependency() {
    function processFile(filename, files) {
        if (!/\.ts.?$/.test(filename)) {
            filename += '.ts';
        }
        var index = files.indexOf(filename);
        if (index >= 0) {
            files = files.slice(index);
            files.push(filename);
            err(`Circular dependency: \r\n${files.join(' =>\r\n')}`);
        }

        files.push(filename);
        var dir = path.dirname(filename);
        var content = fs.readFileSync(filename).toString();
        var reg = /from\s+'([^']+)'/g;
        var match;
        while ((match = reg.exec(content))) {
            var nextfile = match[1];
            if (nextfile && nextfile[0] == '.') {
                processFile(path.resolve(dir, nextfile), files.slice());
            }
        }
    }

    packages.forEach(package => {
        processFile(path.join(packagesPath, package, 'lib/index'), []);
    });
}

function normalize() {
    var knownCustomizedPackages = {};

    packages.forEach(package => {
        var packageJson = readPackageJson(package);

        Object.keys(packageJson.dependencies).forEach(dep => {
            if (knownCustomizedPackages[dep]) {
                packageJson.dependencies[dep] = knownCustomizedPackages[dep];
            } else if (packages.indexOf(dep) > -1) {
                packageJson.dependencies[dep] = mainPackageJson.version;
            } else if (mainPackageJson.dependencies && mainPackageJson.dependencies[dep]) {
                packageJson.dependencies[dep] = mainPackageJson.dependencies[dep];
            } else if (!packageJson.dependencies[dep]) {
                console.error('there is a missing dependency in the main package.json: ', dep);
            }
        });

        if (packageJson.version) {
            knownCustomizedPackages[package] = packageJson.version;
        } else {
            packageJson.version = version;
        }

        packageJson.typings = './lib/index.d.ts';
        packageJson.main = './lib/index.js';
        packageJson.license = 'MIT';
        packageJson.repository = {
            type: 'git',
            url: 'https://github.com/Microsoft/roosterjs',
        };

        var targetPackagePath = path.join(distPath, package);
        var targetFileName = path.join(targetPackagePath, 'package.json');
        mkdirp.sync(targetPackagePath);
        fs.writeFileSync(targetFileName, JSON.stringify(packageJson, null, 4));
    });
}

function runNode(command, cwd, stdio) {
    exec('node ' + command, {
        stdio: stdio || 'inherit',
        cwd,
    });
}

function tslint() {
    var tslintPath = path.join(nodeModulesPath, 'tslint/bin/tslint');
    var projectPath = path.join(rootPath, 'tools/tsconfig.tslint.json');
    runNode(tslintPath + ' --project ' + projectPath, rootPath);
}

function tsc(isAmd) {
    runNode(
        typescriptPath + ` -t es5 --moduleResolution node -m ${isAmd ? 'amd' : 'commonjs'}`,
        packagesPath
    );

    if (isAmd) {
        packages.forEach(package => {
            var packagePath = path.join(distPath, package);
            fs.renameSync(`${packagePath}/lib`, `${packagePath}/lib-amd`);
        });
    } else {
        packages.forEach(package => {
            var copy = fileName => {
                var source = path.join(packagesPath, package, fileName);
                var target = path.join(distPath, package, fileName);
                fs.copyFileSync(source, target);
            };
            glob.sync('@(README|readme)*.*').forEach(copy);
            glob.sync('@(license|LICENSE)*').forEach(copy);
        });
    }
}

function getPackedFileName(isProduction, isAmd) {
    return `rooster${isAmd ? '-amd' : ''}${isProduction ? '-min' : ''}.js`;
}

async function pack(isProduction, isAmd) {
    var filename = getPackedFileName(isProduction, isAmd);
    var webpackConfig = {
        entry: path.join(packagesPath, 'roosterjs/lib/index.ts'),
        devtool: 'source-map',
        output: {
            filename,
            path: roosterJsDistPath,
            libraryTarget: isAmd ? 'amd' : undefined,
            library: isAmd ? undefined : 'roosterjs',
        },
        resolve: {
            extensions: ['.ts'],
            modules: [packagesPath],
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: 'ts-loader',
                    options: {
                        compilerOptions: {
                            declaration: false,
                            preserveConstEnums: false,
                        },
                    },
                },
            ],
        },
        stats: 'minimal',
        mode: isProduction ? 'production' : 'development',
        optimization: {
            minimize: isProduction,
        },
    };

    await new Promise((resolve, reject) => {
        webpack(webpackConfig).run(err => {
            if (err) {
                reject(err);
            } else {
                var targetFile = path.join(roosterJsDistPath, filename);
                if (isProduction && !isAmd) {
                    countWord(targetFile);
                    exploreSourceMap(targetFile);
                }
                resolve();
            }
        });
    });
}

function countWord(inputFile) {
    var outputFile = path.join(roosterJsDistPath, 'wordstat.txt');
    var file = fs.readFileSync(inputFile).toString();
    var reg = /[a-zA-Z0-9_]+/g;
    var match;
    var map = {};

    while ((match = reg.exec(file))) {
        map[match] = (map[match] || 0) + 1;
    }

    var array = Object.keys(map).map(key => ({
        key,
        len: key.length * map[key],
    }));

    array.sort((a, b) => b.len - a.len);
    var result = array.reduce((result, item) => result + `${item.key},${item.len}\r\n`, '');
    fs.writeFileSync(outputFile, result);
}

function exploreSourceMap(inputFile) {
    var commandPath = path.join(nodeModulesPath, 'source-map-explorer/index.js');
    var targetFile = path.join(roosterJsDistPath, 'sourceMap.html');
    runNode(`${commandPath} -m --html ${inputFile} > ${targetFile}`, rootPath);
}

var dtsQueue = [];
var dtsFileName;

function prepareDts() {
    dtsQueue = dts.prepareDts(rootPath, distPath, ['roosterjs/lib/index.d.ts']);
}

function buildDts(isAmd) {
    mkdirp.sync(roosterJsDistPath);
    let filename = dts.output(roosterJsDistPath, 'roosterjs', isAmd, dtsQueue);
    if (!isAmd) {
        dtsFileName = filename;
    }
}

function verifyDts() {
    runNode(typescriptPath + ' ' + dtsFileName + ' --noEmit', rootPath);
}

function buildDoc() {
    let config = {
        tsconfig: path.join(packagesPath, 'tsconfig.json'),
        out: path.join(roosterJsDistPath, '..', 'docs'),
        readme: path.join(rootPath, 'reference.md'),
        name: '"RoosterJs API Reference"',
        mode: 'modules',
        ignoreCompilerErrors: '',
        preserveConstEnums: '',
        stripInternal: '',
        target: 'ES5',
        excludeExternals: '',
        logger: 'none',
        exclude: '**/test/**/*.ts',
        excludePrivate: '',
        excludeNotExported: '',
        'external-modulemap': '".*\\/(roosterjs[a-zA-Z0-9\\-]*)\\/lib\\/"',
    };

    let cmd = path.join(nodeModulesPath, 'typedoc/bin/typedoc');
    for (let key of Object.keys(config)) {
        let value = config[key];
        cmd += ` --${key} ${value}`;
    }

    runNode(cmd, rootPath, 'pipe');
}

function copySample() {
    var ncp = require('ncp');

    var target = path.join(distPath, 'roosterjs/samplecode');
    var source = path.join(rootPath, 'publish/samplecode');

    ncp.ncp(source, target, error => {
        if (error) {
            err(error);
        }
    });
}

async function buildDemoSite() {
    var sourcePathRoot = path.join(rootPath, 'publish/samplesite');
    var sourcePath = path.join(sourcePathRoot, 'scripts');
    runNode(typescriptPath + ' --noEmit ', sourcePath);

    var distPathRoot = path.join(distPath, 'roosterjs');
    var filename = 'demo.js';
    var webpackConfig = {
        entry: path.join(sourcePath, 'index.ts'),
        devtool: 'source-map',
        output: {
            filename,
            path: distPathRoot,
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.svg', '.scss', '.'],
            modules: [sourcePath, packagesPath, nodeModulesPath],
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                },
                {
                    test: /\.svg$/,
                    loader: 'url-loader',
                    options: {
                        mimetype: 'image/svg+xml',
                    },
                },
                {
                    test: /\.scss$/,
                    use: [
                        '@microsoft/loader-load-themed-styles',
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                            },
                        },
                        'sass-loader',
                    ],
                },
            ],
        },
        externals: packages.reduce(
            (externals, package) => {
                externals[package] = 'roosterjs';
                return externals;
            },
            {
                react: 'React',
                'react-dom': 'ReactDOM',
            }
        ),
        stats: 'minimal',
        mode: 'production',
        optimization: {
            minimize: true,
        },
    };

    await new Promise((resolve, reject) => {
        webpack(webpackConfig).run(err => {
            if (err) {
                reject(err);
            } else {
                fs.copyFileSync(
                    path.resolve(sourcePathRoot, 'index.html'),
                    path.resolve(distPathRoot, 'index.html')
                );
                var outputFilename = path.join(distPathRoot, filename);
                fs.writeFileSync(
                    outputFilename,
                    `window.roosterJsVer = "v${version}";` +
                        fs.readFileSync(outputFilename).toString()
                );
                resolve();
            }
        });
    });
}

function err(message) {
    let ex = new Error('\n' + message);
    console.error(ex.message);
    throw ex;
}

function publish() {
    packages.forEach(package => {
        var json = readPackageJson(package);

        if (!json.version) {
            exec(`npm publish`, {
                stdio: 'inherit',
                cwd: path.join(distPath, package),
            });
        }
    });
}

class Runner {
    constructor() {
        this.tasks = [];
    }

    addTask(callback, name) {
        this.tasks.push({
            callback: async () => {
                await callback();
            },
            name,
        });
    }

    run() {
        (async () => {
            console.log(`Start building roosterjs version ${version}\n`);

            var bar = new ProgressBar('[:bar] (:current/:total finished) :message', {
                total: this.tasks.length,
                width: 40,
                complete: '#',
            });

            for (var i = 0; i < this.tasks.length; i++) {
                var task = this.tasks[i];

                if (i == 0) {
                    bar.tick(0, {
                        message: task.name,
                    });
                } else {
                    bar.tick({
                        message: task.name,
                    });
                }

                await task.callback().catch(e => {
                    throw e;
                });

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

function buildAll(options) {
    var tasks = [
        {
            message: 'Running tslint...',
            callback: tslint,
            enabled: options.tslint,
        },
        {
            message: 'Checking cicular dependency...',
            callback: checkDependency,
            enabled: options.checkdep,
        },
        {
            message: 'Clearing destination folder...',
            callback: clean,
            enabled: options.clean,
        },
        {
            message: 'Normalizing packages...',
            callback: normalize,
            enabled: options.normalize,
        },
        {
            message: 'Building packages in AMD mode...',
            callback: () => tsc(true),
            enabled: options.buildamd,
        },
        {
            message: 'Building packages in CommonJs mode...',
            callback: () => tsc(false),
            enabled: options.buildcommonjs,
        },
        ...[false, true].map(isAmd => ({
            message: `Packing ${getPackedFileName(false, isAmd)}...`,
            callback: async () => pack(false, isAmd),
            enabled: options.pack,
        })),
        ...[false, true].map(isAmd => ({
            message: `Packing ${getPackedFileName(true, isAmd)}...`,
            callback: async () => pack(true, isAmd),
            enabled: options.packprod || (!isAmd && options.builddemo),
        })),
        {
            message: 'Collecting information for type definition file...',
            callback: prepareDts,
            enabled: options.dts,
        },
        ...[false, true].map(isAmd => ({
            message: `Generating type definition file for ${isAmd ? 'AMD' : 'CommonJs'}...`,
            callback: () => buildDts(isAmd),
            enabled: options.dts,
        })),
        {
            message: 'Verifying type definition file...',
            callback: verifyDts,
            enabled: options.dts,
        },
        {
            message: 'Copying sample code...',
            callback: copySample,
            enabled: options.copysample,
        },
        {
            message: 'Building demo site...',
            callback: buildDemoSite,
            enabled: options.builddemo,
        },
        {
            message: 'Publishing to npm...',
            callback: publish,
            enabled: options.publish,
        },
        {
            message: 'Building documents...',
            callback: buildDoc,
            enabled: options.builddoc,
        },
    ];

    var runner = new Runner();
    tasks.filter(task => task.enabled).forEach(task => runner.addTask(task.callback, task.message));
    runner.run();
}

function parseOptions(additionalParams) {
    var params = [...process.argv, ...additionalParams];
    var options = {};
    for (var i = 0; i < params.length; i++) {
        var index = commands.indexOf(params[i]);

        if (index >= 0) {
            options[commands[index]] = true;
        }
    }
    return options;
}

// For debugging, put the build options below:
// e.g.
// let options = ['pack', 'packprod'];
let options = [];
buildAll(parseOptions(options));
