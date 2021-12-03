'use strict';

const path = require('path');
const fs = require('fs');
const {
    rootPath,
    packagesPath,
    nodeModulesPath,
    packages,
    distPath,
    runNode,
} = require('./common');

function buildAmd() {
    const typescriptPath = path.join(nodeModulesPath, 'typescript/lib/tsc.js');
    const tsconfigPath = path.join(packagesPath, 'tsconfig.build.json');
    runNode(
        typescriptPath + ` -p ${tsconfigPath} -t es5 --moduleResolution node -m amd`,
        packagesPath
    );

    packages.forEach(packageName => {
        const packagePath = path.join(distPath, packageName);
        fs.renameSync(`${packagePath}/lib`, `${packagePath}/lib-amd`);
    });
}

module.exports = {
    message: 'Building packages in AMD mode...',
    callback: buildAmd,
    enabled: options => options.buildamd,
};
