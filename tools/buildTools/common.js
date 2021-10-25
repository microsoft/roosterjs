'use strict';

const path = require('path');
const exec = require('child_process').execSync;
const glob = require('glob');
const fs = require('fs');
const assign = require('object-assign');
const toposort = require('toposort');

const rootPath = path.join(__dirname, '../..');
const packagesPath = path.join(rootPath, 'packages');
const nodeModulesPath = path.join(rootPath, 'node_modules');
const typescriptPath = path.join(nodeModulesPath, 'typescript/lib/tsc.js');
const distPath = path.join(rootPath, 'dist');
const roosterJsDistPath = path.join(distPath, 'roosterjs/dist');
const deployPath = path.join(distPath, 'deploy');

function collectPackages() {
    const packagePaths = glob.sync(
        path.relative(rootPath, path.join(packagesPath, '**', 'package.json')),
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
        readFromSourceFolder ? packagesPath : distPath,
        packageName,
        'package.json'
    );
    const content = fs.readFileSync(packageJsonFilePath);
    return JSON.parse(content);
}

const mainPackageJson = JSON.parse(fs.readFileSync(path.join(rootPath, 'package.json')));

module.exports = {
    rootPath,
    packagesPath,
    nodeModulesPath,
    typescriptPath,
    distPath,
    roosterJsDistPath,
    deployPath,
    runNode,
    err,
    packages,
    readPackageJson,
    mainPackageJson,
};
