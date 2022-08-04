'use strict';

const path = require('path');
const mkdirp = require('mkdirp');
const fs = require('fs');
const processConstEnum = require('./processConstEnum');
const {
    packages,
    allPackages,
    distPath,
    readPackageJson,
    mainPackageJson,
    err,
} = require('./common');

function normalize() {
    const knownCustomizedPackages = {};

    allPackages.forEach(packageName => {
        const packageJson = readPackageJson(packageName, true /*readFromSourceFolder*/);

        Object.keys(packageJson.dependencies).forEach(dep => {
            if (packageJson.dependencies[dep]) {
                // No op, keep the specified value
            } else if (knownCustomizedPackages[dep]) {
                packageJson.dependencies[dep] = '^' + knownCustomizedPackages[dep];
            } else if (packages.indexOf(dep) > -1) {
                packageJson.dependencies[dep] = '^' + mainPackageJson.version;
            } else if (mainPackageJson.dependencies && mainPackageJson.dependencies[dep]) {
                packageJson.dependencies[dep] = mainPackageJson.dependencies[dep];
            } else if (!packageJson.dependencies[dep]) {
                err('there is a missing dependency in the main package.json: ' + dep);
            }
        });

        if (packageJson.version) {
            knownCustomizedPackages[packageName] = packageJson.version;
        } else {
            packageJson.version = mainPackageJson.version;
        }

        packageJson.typings = './lib/index.d.ts';
        packageJson.main = './lib/index.js';
        packageJson.license = 'MIT';
        packageJson.repository = {
            type: 'git',
            url: 'https://github.com/Microsoft/roosterjs',
        };

        const targetPackagePath = path.join(distPath, packageName);
        const targetFileName = path.join(targetPackagePath, 'package.json');
        mkdirp.sync(targetPackagePath);
        fs.writeFileSync(targetFileName, JSON.stringify(packageJson, null, 4));
    });

    processConstEnum();
}

module.exports = {
    message: 'Normalizing packages...',
    callback: normalize,
    enabled: options => options.normalize,
};
