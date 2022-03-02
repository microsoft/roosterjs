'use strict';

const path = require('path');
const fs = require('fs');
const { allPackages, readPackageJson, findPackageRoot, err } = require('./common');

function getPossibleNames(dir, objectName) {
    return [
        path.join(dir, objectName),
        path.join(dir, objectName + '.ts'),
        path.join(dir, objectName + '.tsx'),
    ];
}

function processFile(dir, filename, files, packageDependencies, peerDependencies) {
    if (packageDependencies.indexOf(filename) >= 0 || peerDependencies.indexOf(filename) >= 0) {
        return;
    }

    const thisFilename = getPossibleNames(dir, filename).filter(name => fs.existsSync(name))[0];

    if (!thisFilename) {
        err(
            'Found dependency issue when processing file ' +
                filename +
                ' under ' +
                dir +
                ': File not found'
        );
    }

    const index = files.indexOf(thisFilename);

    if (index >= 0) {
        files = files.slice(index);
        files.push(thisFilename);
        err(`Circular dependency: \r\n${files.join(' =>\r\n')}`);
    }

    var match;
    try {
        files.push(thisFilename);
        var dir = path.dirname(thisFilename);
        var content = fs.readFileSync(thisFilename).toString();
        var reg = /from\s+'([^']+)';$/gm;
        while ((match = reg.exec(content))) {
            var nextFile = match[1];
            if (nextFile) {
                processFile(dir, nextFile, files.slice(), packageDependencies, peerDependencies);
            }
        }
    } catch (e) {
        err(
            'Found dependency issue when processing file ' +
                thisFilename +
                ' with dependency "' +
                (match ? match[0] : '<Not found>') +
                '": ' +
                e
        );
    }
}

function checkDependency() {
    allPackages.forEach(packageName => {
        const packageRoot = findPackageRoot(packageName);

        var packageJson = readPackageJson(packageName, true /*readFromSourceFolder*/);
        var dependencies = Object.keys(packageJson.dependencies);
        var peerDependencies = packageJson.peerDependencies
            ? Object.keys(packageJson.peerDependencies)
            : [];
        processFile(
            packageRoot,
            path.join(packageName, 'lib/index'),
            [],
            dependencies,
            peerDependencies
        );
    });
}

module.exports = {
    message: 'Checking circular dependency...',
    callback: checkDependency,
    enabled: options => options.checkdep,
};
