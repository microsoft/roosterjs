'use strict';

const path = require('path');
const exec = require('child_process').execSync;
const glob = require('glob');
const fs = require('fs');
const assign = require('object-assign');
const toposort = require('toposort');
const webpack = require('webpack');

const packagesName = 'packages';
const packagesUiName = 'packages-ui';
const packagesContentModelName = 'packages-content-model';

const rootPath = path.join(__dirname, '../..');
const packagesPath = path.join(rootPath, packagesName);
const packagesUiPath = path.join(rootPath, packagesUiName);
const packagesContentModelPath = path.join(rootPath, packagesContentModelName);
const nodeModulesPath = path.join(rootPath, 'node_modules');
const typescriptPath = path.join(nodeModulesPath, 'typescript/lib/tsc.js');
const distPath = path.join(rootPath, 'dist');
const roosterJsDistPath = path.join(distPath, 'roosterjs/dist');
const roosterJsUiDistPath = path.join(distPath, 'roosterjs-react/dist');
const contentModelDistPath = path.join(distPath, 'roosterjs-content-model/dist');
const deployPath = path.join(distPath, 'deploy');
const compatibleEnumPath = path.join(
    packagesPath,
    'roosterjs-editor-types',
    'lib',
    'compatibleEnum'
);

function collectPackages(startPath) {
    const packagePaths = glob.sync(
        path.relative(rootPath, path.join(startPath, '**', 'package.json')),
        { nocase: true }
    );

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
const packagesUI = collectPackages(packagesUiPath);
const packagesContentModel = collectPackages(packagesContentModelPath);
const allPackages = packages.concat(packagesUI).concat(packagesContentModel);

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

function findPackageRoot(packageName) {
    return packages.indexOf(packageName) >= 0
        ? packagesName
        : packagesUI.indexOf(packageName) >= 0
        ? packagesUiName
        : packagesContentModel.indexOf(packageName) >= 0
        ? packagesContentModelName
        : null;
}

function readPackageJson(packageName, readFromSourceFolder) {
    const packageJsonFilePath = path.join(
        readFromSourceFolder ? rootPath + '/' + findPackageRoot(packageName) : distPath,
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

function getWebpackExternalCallback(externalLibraryPairs, internalLibraries) {
    const externalMap = new Map([
        ['react', 'React'],
        ['react-dom', 'ReactDOM'],
        [/^office-ui-fabric-react(\/.*)?$/, 'FluentUIReact'],
        [/^@fluentui(\/.*)?$/, 'FluentUIReact'],
        ...packages.filter(x => internalLibraries.indexOf(x) < 0).map(p => [p, 'roosterjs']),
        ...externalLibraryPairs,
    ]);

    return (_, request, callback) => {
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

const buildConfig = {
    packages: {
        targetPath: roosterJsDistPath,
        packEntry: path.join(packagesPath, 'roosterjs/lib/index.ts'),
        jsFileBaseName: 'rooster',
        targetPackages: ['roosterjs'],
        startFileName: 'roosterjs/lib/index.d.ts',
        libraryName: 'roosterjs',
        targetFileName: 'rooster',
        externalHandler: undefined,
    },
    'packages-ui': {
        targetPath: roosterJsUiDistPath,
        packEntry: path.join(packagesUiPath, 'roosterjs-react/lib/index.ts'),
        jsFileBaseName: 'rooster-react',
        targetPackages: packagesUI,
        startFileName: 'roosterjs-react/lib/index.d.ts',
        libraryName: 'roosterjsReact',
        targetFileName: 'rooster-react',
        externalHandler: getWebpackExternalCallback([], []),
        dependsOnRoosterJs: true,
        dependsOnReact: true,
    },
    'packages-content-model': {
        targetPath: contentModelDistPath,
        packEntry: path.join(packagesContentModelPath, 'roosterjs-content-model/lib/index.ts'),
        jsFileBaseName: 'rooster-content-model',
        targetPackages: packagesContentModel,
        startFileName: 'roosterjs-content-model/lib/index.d.ts',
        libraryName: 'roosterjsContentModel',
        targetFileName: 'rooster-content-model',
        externalHandler: getWebpackExternalCallback(
            [[/^roosterjs-editor-types\/lib\/compatibleTypes/, 'roosterjs']],
            packagesContentModel
        ),
        dependsOnRoosterJs: true,
    },
};

const versions = JSON.parse(fs.readFileSync(path.join(rootPath, 'versions.json')));

module.exports = {
    rootPath,
    packagesPath,
    packagesUiPath,
    packagesContentModelPath,
    nodeModulesPath,
    typescriptPath,
    distPath,
    roosterJsDistPath,
    roosterJsUiDistPath,
    compatibleEnumPath,
    deployPath,
    runNode,
    err,
    packages,
    packagesUI,
    packagesContentModel,
    allPackages,
    readPackageJson,
    mainPackageJson,
    findPackageRoot,
    runWebPack,
    getWebpackExternalCallback,
    contentModelDistPath,
    buildConfig,
    versions,
};
