'use strict';

const fs = require('fs');
const path = require('path');
const {
    runNode,
    rootPath,
    nodeModulesPath,
    distPath,
    packagesPath,
    packagesUiPath,
    allPackages,
} = require('./common');

function buildCommonJs() {
    const typescriptPath = path.join(nodeModulesPath, 'typescript/lib/tsc.js');

    runNode(
        typescriptPath +
            ` -p ${path.join(
                packagesPath,
                'tsconfig.json'
            )} -t es5 --moduleResolution node -m commonjs`
    );
    runNode(typescriptPath, packagesUiPath);

    allPackages.forEach(packageName => {
        const copy = fileName => {
            const source = path.join(rootPath, fileName);
            const target = path.join(distPath, packageName, fileName);
            fs.copyFileSync(source, target);
        };
        copy('README.md');
        copy('LICENSE');
    });
}

module.exports = {
    message: 'Building packages in CommonJs mode...',
    callback: buildCommonJs,
    enabled: options => options.buildcommonjs,
};
