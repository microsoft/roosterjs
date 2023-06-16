'use strict';

const path = require('path');
const fs = require('fs');
const {
    packagesPath,
    packagesUiPath,
    nodeModulesPath,
    allPackages,
    distPath,
    runNode,
} = require('./common');

function buildMjs() {
    const typescriptPath = path.join(nodeModulesPath, 'typescript/lib/tsc.js');

    runNode(
        typescriptPath +
            ` -p ${path.join(
                packagesPath,
                'tsconfig.json'
            )} -t es5 --moduleResolution node -m esnext`,
        packagesPath
    );
    runNode(
        typescriptPath +
            ` -p ${path.join(
                packagesUiPath,
                'tsconfig.json'
            )} -t es5 --moduleResolution node -m esnext`,
        packagesPath
    );

    allPackages.forEach(packageName => {
        const packagePath = path.join(distPath, packageName);
        fs.renameSync(`${packagePath}/lib`, `${packagePath}/lib-mjs`);
    });
}

module.exports = {
    message: 'Building packages in ESNEXT mode...',
    callback: buildMjs,
    enabled: options => options.buildmjs,
};
