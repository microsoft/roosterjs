'use strict';

const path = require('path');
const exec = require('child_process').execSync;
const glob = require('glob');
const fs = require('fs');
const assign = require('object-assign');
const toposort = require('toposort');
const webpack = require('webpack');

const packagesName = 'packages';
const rootPath = path.join(__dirname, '../..');
const packagesPath = path.join(rootPath, packagesName);
const nodeModulesPath = path.join(rootPath, 'node_modules');
const typescriptPath = path.join(nodeModulesPath, 'typescript/lib/tsc.js');
const distPath = path.join(rootPath, 'dist');
const roosterJsDistPath = path.join(distPath, 'roosterjs/dist');
const deployPath = path.join(distPath, 'deploy');
const compatibleEnumPath = path.join(
    packagesPath,
    'roosterjs-editor-types',
    'lib',
    'compatibleEnum'
);

function collectPackages(startPath) {
    const packagePaths = glob
        .sync(path.relative(rootPath, path.join(startPath, '**', 'package.json')), { nocase: true })
        .filter(x => x.indexOf('node_modules') < 0);

    const packageNames = packagePaths.map(path =>
        path.replace('packages/', '').replace('/package.json', '')
    );
    var graph = [];

    packagePaths.forEach(path => {
        const packageJson = JSON.parse(fs.readFileSync(path).toString());
        const packageName = packageJson.name;
        const depsMap = {};

        if ('dependencies' in packageJson) {
            assign(depsMap, packageJson.dependencies);
        }

        if ('devDependencies' in packageJson) {
            assign(depsMap, packageJson.devDependencies);
        }

        const deps = Object.keys(depsMap).filter(d => packageNames.indexOf(d) >= 0);

        deps.forEach(child => {
            graph.push([child, packageName]);
        });

        if (deps.length == 0) {
            graph.push([packageName]);
        }
    });

    return toposort(graph).filter(n => n);
}

const packages = collectPackages(packagesPath);

function runNode(command, cwd, stdio) {
    exec('node ' + command, {
        stdio: stdio || 'inherit',
        cwd,
    });
}

function err(message) {
    const ex = new Error('\n' + message);
    console.error(ex.message);
    throw ex;
}

function readPackageJson(packageName, readFromSourceFolder) {
    const packageJsonFilePath = path.join(
        readFromSourceFolder ? rootPath + '/packages' : distPath,
        packageName,
        'package.json'
    );
    const content = fs.readFileSync(packageJsonFilePath);

    return JSON.parse(content);
}

const mainPackageJson = JSON.parse(fs.readFileSync(path.join(rootPath, 'package.json')));

async function runWebPack(config) {
    return new Promise((resolve, reject) => {
        webpack(config).run((err, result) => {
            const compileErrors = result?.compilation?.errors || [];

            if (compileErrors.length > 0) {
                reject(compileErrors);
            } else if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function getWebpackExternalCallback(externalLibraryPairs) {
    const externalMap = new Map([
        ['react', 'React'],
        ['react-dom', 'ReactDOM'],
        [/^office-ui-fabric-react(\/.*)?$/, 'FluentUIReact'],
        [/^@fluentui(\/.*)?$/, 'FluentUIReact'],
        ...legacyPackages.map(p => [p, 'roosterjs']),
        ...externalLibraryPairs,
    ]);

    return ({ request }, callback) => {
        for (const [key, value] of externalMap) {
            if (key instanceof RegExp && key.test(request)) {
                return callback(null, request.replace(key, value));
            } else if (request === key) {
                return callback(null, value);
            }
        }

        callback();
    };
}

const legacyPackages = [
    'roosterjs',
    'roosterjs-editor-types',
    'roosterjs-editor-types-compatible',
    'roosterjs-editor-dom',
    'roosterjs-editor-core',
    'roosterjs-editor-api',
    'roosterjs-editor-plugins',
    'roosterjs-color-utils',
];
const reactPackages = ['roosterjs-react'];
const mainPackages = [
    'roosterjs-content-model',
    'roosterjs-content-model-types',
    'roosterjs-content-model-dom',
    'roosterjs-content-model-core',
    'roosterjs-content-model-api',
    'roosterjs-content-model-plugins',
];
const legacyAdapterPackages = ['roosterjs-editor-adapter'];

const buildConfig = {
    legacy: {
        targetPath: roosterJsDistPath,
        packEntry: path.join(packagesPath, 'roosterjs/lib/index.ts'),
        jsFileBaseName: 'rooster',
        targetPackages: ['roosterjs'],
        startFileName: 'roosterjs/lib/index.d.ts',
        libraryName: 'roosterjs',
        targetFileName: 'rooster',
        externalHandler: undefined,
        packages: legacyPackages,
    },
    react: {
        targetPath: roosterJsDistPath,
        packEntry: path.join(packagesPath, 'roosterjs-react/lib/index.ts'),
        jsFileBaseName: 'rooster-react',
        targetPackages: ['roosterjs-react'],
        startFileName: 'roosterjs-react/lib/index.d.ts',
        libraryName: 'roosterjsReact',
        targetFileName: 'rooster-react',
        externalHandler: getWebpackExternalCallback([]),
        dependsOnRoosterJs: true,
        dependsOnReact: true,
        packages: reactPackages,
    },
    main: {
        targetPath: roosterJsDistPath,
        packEntry: path.join(packagesPath, 'roosterjs-content-model/lib/index.ts'),
        jsFileBaseName: 'rooster-content-model',
        targetPackages: ['roosterjs-content-model'],
        startFileName: 'roosterjs-content-model/lib/index.d.ts',
        libraryName: 'roosterjsContentModel',
        targetFileName: 'rooster-content-model',
        externalHandler: undefined,
        dependsOnRoosterJs: false,
        packages: mainPackages,
    },
    legacyAdapter: {
        targetPath: roosterJsDistPath,
        packEntry: path.join(packagesPath, 'roosterjs-editor-adapter/lib/index.ts'),
        jsFileBaseName: 'rooster-adapter',
        targetPackages: ['roosterjs-editor-adapter'],
        startFileName: 'roosterjs-editor-adapter/lib/index.d.ts',
        libraryName: 'roosterjsAdapter',
        targetFileName: 'rooster-adapter',
        externalHandler: getWebpackExternalCallback([
            [/^roosterjs-editor-types\/lib\/compatibleTypes/, 'roosterjs'],
            [/^roosterjs-content-model.*/, 'roosterjsContentModel'],
        ]),
        dependsOnRoosterJs: true,
        dependsOnMain: true,
        packages: legacyAdapterPackages,
    },
};

const versions = JSON.parse(fs.readFileSync(path.join(rootPath, 'versions.json')));

module.exports = {
    rootPath,
    packagesPath,
    nodeModulesPath,
    typescriptPath,
    distPath,
    roosterJsDistPath,
    compatibleEnumPath,
    deployPath,
    runNode,
    err,
    packages,
    readPackageJson,
    mainPackageJson,
    runWebPack,
    getWebpackExternalCallback,
    buildConfig,
    versions,
};
