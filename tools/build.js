var exec = require('child_process').execSync;
var fs = require('fs');
var path = require('path');
var ProgressBar = require('progress');
var webpack = require('webpack');
var glob = require('glob');
var toposort = require('toposort');
var assign = require('object-assign');

// Paths
var rootPath = path.join(__dirname, '..');
var packagesPath = path.join(rootPath, 'packages');
var nodeModulesPath = path.join(rootPath, 'node_modules');
var typescriptPath = path.join(nodeModulesPath, 'typescript/lib/tsc.js');
var distPath = path.join(rootPath, 'dist');

// Packages
var packages = collectPackages(packagesPath);
var mainPackageJson = JSON.parse(fs.readFileSync(path.join(rootPath, 'package.json')));
var version = mainPackageJson.version;
var license = fs.readFileSync(path.join(rootPath, 'LICENSE')).toString();

// Commands
var commands = [
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
    var rimrafPath = path.join(nodeModulesPath, 'rimraf/bin');
    exec(`node ${rimrafPath} ${distPath}`, {
        stdio: 'inherit',
        cwd: rootPath,
    });
}

function normalize() {
    var knownCustomizedPackages = {};
    const mkdirp = require('mkdirp');

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

function tslint() {
    var tslintPath = path.join(nodeModulesPath, 'tslint/bin/tslint');
    var projectPath = path.join(rootPath, 'tools/tsconfig.tslint.json');
    exec('node ' + tslintPath + ' --project ' + projectPath, {
        stdio: 'inherit',
        cwd: rootPath,
    });
}

function buildPackage(package, module) {
    var packagePath = path.join(packagesPath, package);
    var copy = fileName => {
        var source = path.join(packagePath, fileName);
        var target = path.join(distPath, package, fileName);
        fs.copyFileSync(source, target);
    };

    glob.sync('@(README|readme)*.*').forEach(copy);
    glob.sync('@(license|LICENSE)*').forEach(copy);

    var typescriptCommand = 'node ' + typescriptPath;
    exec(typescriptCommand + ` -t es5 --moduleResolution node -m ${module}`, {
        stdio: 'inherit',
        cwd: packagePath,
    });
}

function renameAmd() {
    packages.forEach(package => {
        var packagePath = path.join(distPath, package);
        fs.renameSync(`${packagePath}/lib`, `${packagePath}/lib-amd`);
    });
}

function getPackedFileName(isProduction, isAmd) {
    return `rooster${isAmd ? '-amd' : ''}${isProduction ? '-min' : ''}.js`;
}

async function pack(isProduction, isAmd) {
    var packFilePath = path.join(distPath, 'roosterjs/dist');
    var filename = getPackedFileName(isProduction, isAmd);
    var webpackConfig = {
        entry: path.join(packagesPath, 'roosterjs/lib/index.ts'),
        devtool: 'source-map',
        output: {
            filename,
            path: packFilePath,
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

    var targetFile = path.join(packFilePath, filename);

    await new Promise((resolve, reject) => {
        webpack(webpackConfig).run(err => {
            if (err) {
                reject(err);
            } else {
                insertLicense(targetFile);
                resolve();
            }
        });
    });
}

function insertLicense(filename) {
    var fileContent = fs.readFileSync(filename).toString();
    fs.writeFileSync(
        filename,
        `/*\r\n    VERSION: ${version}\r\n\r\n${license}\r\n*/\r\n${fileContent}`
    );
}

function buildDts(isAmd) {
    var dts = require('./dts');
    dts(isAmd);
}

function copySample() {
    var ncp = require('ncp');

    var target = path.join(distPath, 'roosterjs/samplecode');
    var source = path.join(rootPath, 'publish/samplecode');

    ncp.ncp(source, target, err => {
        if (err) {
            throw err;
        }
    });
}

async function buildDemoSite() {
    var sourcePath = path.join(rootPath, 'publish/samplesite/scripts');
    var distPathRoot = path.join(distPath, 'roosterjs/samplesite');
    var distScriptPath = path.join(distPathRoot, 'scripts');
    var filename = 'demo.js';
    var targetFile = path.join(distScriptPath, filename);

    var webpackConfig = {
        entry: path.join(sourcePath, 'index.ts'),
        devtool: 'source-map',
        output: {
            filename,
            path: distScriptPath,
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
        stats: 'minimal',
        mode: 'development',
    };

    // 1. Run tsc with --noEmit to do code check
    exec('node ' + typescriptPath + ' --noEmit ', {
        stdio: 'inherit',
        cwd: sourcePath,
    });

    // 2. Run webpack to generate target code
    await new Promise((resolve, reject) => {
        webpack(webpackConfig).run(err => {
            if (err) {
                reject(err);
            } else {
                insertLicense(targetFile);
                fs.copyFileSync(
                    path.resolve(rootPath, 'index.html'),
                    path.resolve(distPathRoot, 'index.html')
                );
                fs.writeFileSync(
                    path.resolve(distPathRoot, 'scripts', 'version.js'),
                    `window.roosterJsVer = "v${version}";`
                );
                resolve();
            }
        });
    });
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

    async run() {
        console.log(`Start building roosterjs version ${version}\n`);

        var bar = new ProgressBar(':bar :message (:current/:total finished)', {
            total: this.tasks.length,
            width: 60,
            complete: '>',
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
        }

        bar.tick({
            message: '',
        });
        console.log('\nBuild completed successfully.');
    }
}

async function buildAll(options) {
    var tasks = [
        {
            message: 'Clearing destination folder',
            callback: clean,
            enabled: options.clean,
        },
        {
            message: 'Normalizing packages',
            callback: normalize,
            enabled: options.normalize,
        },
        {
            message: 'Checking code styles',
            callback: tslint,
            enabled: options.tslint,
        },
        ...packages.map(package => ({
            message: `Building package ${package} in AMD mode`,
            callback: () => buildPackage(package, 'amd'),
            enabled: options.buildamd,
        })),
        {
            message: 'Renaming AMD library folders',
            callback: renameAmd,
            enabled: options.buildamd,
        },
        ...packages.map(package => ({
            message: `Building package ${package} in CommonJs mode`,
            callback: () => buildPackage(package, 'commonjs'),
            enabled: options.buildcommonjs,
        })),
        ...[false, true].map(isAmd => ({
            message: `Packing ${getPackedFileName(false, isAmd)}`,
            callback: async () => pack(false, isAmd),
            enabled: options.pack,
        })),
        ...[false, true].map(isAmd => ({
            message: `Packing ${getPackedFileName(true, isAmd)}`,
            callback: async () => pack(true, isAmd),
            enabled: options.packprod,
        })),
        ...[false, true].map(isAmd => ({
            message: `Generating type definition file for ${isAmd ? 'AMD' : 'CommonJs'}`,
            callback: () => buildDts(isAmd),
            enabled: options.dts,
        })),
        {
            message: 'Copying sample code',
            callback: copySample,
            enabled: options.copysample,
        },
        {
            message: 'Building demo site',
            callback: buildDemoSite,
            enabled: options.builddemo,
        },
        {
            message: 'Publishing to npm',
            callback: publish,
            enabled: options.publish,
        },
    ];

    var runner = new Runner();
    tasks.filter(task => task.enabled).forEach(task => runner.addTask(task.callback, task.message));
    runner.run();
}

function parseOptions() {
    var params = process.argv;
    var options = {};
    for (var i = 0; i < params.length; i++) {
        var index = commands.indexOf(params[i]);

        if (index >= 0) {
            options[commands[index]] = true;
        }
    }
    return options;
}

buildAll(parseOptions());
