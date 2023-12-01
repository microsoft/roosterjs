'use strict';

const path = require('path');
const mkdirp = require('mkdirp');
const fs = require('fs');
const processConstEnum = require('./processConstEnum');
const {
    allPackages,
    distPath,
    readPackageJson,
    mainPackageJson,
    err,
    findPackageRoot,
    versions,
} = require('./common');

function normalize() {
    const knownCustomizedPackages = {};

    allPackages.forEach(packageName => {
        const versionKey = findPackageRoot(packageName);
        const version = versions.overrides?.[packageName] ?? versions[versionKey];
        const packageJson = readPackageJson(packageName, true /*readFromSourceFolder*/);

        Object.keys(packageJson.dependencies).forEach(dep => {
            if (packageJson.dependencies[dep]) {
                // No op, keep the specified value
            } else if (knownCustomizedPackages[dep]) {
                packageJson.dependencies[dep] = '^' + knownCustomizedPackages[dep];
            } else if (allPackages.indexOf(dep) > -1) {
                var depKey = findPackageRoot(dep);
                var depVersion = versions[depKey];
                packageJson.dependencies[dep] = '^' + depVersion;
            } else if (mainPackageJson.dependencies && mainPackageJson.dependencies[dep]) {
                packageJson.dependencies[dep] = mainPackageJson.dependencies[dep];
            } else if (!packageJson.dependencies[dep]) {
                err('there is a missing dependency in the main package.json: ' + dep);
            }
        });

        if (!packageJson.version || packageJson.version == '0.0.0') {
            packageJson.version = version;
        }

        knownCustomizedPackages[packageName] = packageJson.version;

        packageJson.typings = './lib/index.d.ts';
        packageJson.main = './lib/index.js';
        packageJson.module = './lib-mjs/index.js';
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
