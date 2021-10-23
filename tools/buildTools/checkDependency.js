'use strict';

const path = require('path');
const fs = require('fs');
const { packagesPath, packages, readPackageJson, err } = require('./common');

function processFile(dir, filename, files, packageDependencies) {
    if (packageDependencies.indexOf(filename) >= 0) {
        return;
    }

    const thisFilename = path.resolve(dir, !/\.ts.?$/.test(filename) ? filename + '.ts' : filename);
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
                processFile(dir, nextFile, files.slice(), packageDependencies);
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
    packages.forEach(packageName => {
        var packageJson = readPackageJson(packageName, true /*readFromSourceFolder*/);
        var dependencies = Object.keys(packageJson.dependencies);
        processFile(packagesPath, path.join(packageName, 'lib/index'), [], dependencies);
    });
}

module.exports = {
    message: 'Checking circular dependency...',
    callback: checkDependency,
    enabled: options => options.checkdep,
};
