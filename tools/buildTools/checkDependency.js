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

function processFile(dir, filename, files, externalDependencies) {
    if (
        externalDependencies.some(d => (typeof d === 'string' ? d == filename : d.test(filename)))
    ) {
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

    files.push(thisFilename);

    if (index >= 0) {
        const packageNames = files.map(findPackageName).sort();

        if (packageNames[0] == packageNames[packageNames.length - 1]) {
            return; // All packages names are the same, that is allowed
        } else {
            err(`Cross package circular dependency: \r\n${files.join(' =>\r\n')}`);
        }
    }

    var match;
    try {
        var dir = path.dirname(thisFilename);
        var content = fs.readFileSync(thisFilename).toString();
        var reg = /from\s+'([^']+)';$/gm;

        while ((match = reg.exec(content))) {
            var nextFile = match[1];
            if (nextFile) {
                processFile(dir, nextFile, files, externalDependencies);
            }
        }

        files.pop();
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

function findPackageName(filename) {
    for (let i = 0; i < allPackages.length; i++) {
        if (filename.indexOf(allPackages[i])) {
            return allPackages[i];
        }
    }

    err('Package name not found in file name: ' + filename);
}

const GlobalAllowedCrossPackageDependency = [
    'roosterjs-editor-types/lib/compatibleTypes',
    /@fluentui\/react(\/.*)?/,
];

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
            dependencies.concat(peerDependencies).concat(GlobalAllowedCrossPackageDependency)
        );
    });
}

module.exports = {
    message: 'Checking dependency...',
    callback: checkDependency,
    enabled: options => options.checkdep,
};
