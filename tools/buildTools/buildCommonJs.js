'use strict';

const fs = require('fs');
const path = require('path');
const {
    runNode,
    rootPath,
    nodeModulesPath,
    distPath,
    packagesPath,
    packages,
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

    packages.forEach(packageName => {
        const copy = fileName => {
            const source = path.join(rootPath, fileName);
            const target = path.join(distPath, packageName, fileName);
            fs.copyFileSync(source, target);
        };

        const sourceReadme = path.join(packagesPath, packageName, 'README.md');
        if (fs.existsSync(sourceReadme)) {
            fs.copyFileSync(sourceReadme, path.join(distPath, packageName, 'README.md'));
        } else {
            copy('README.md');
        }

        copy('LICENSE');
    });
}

module.exports = {
    message: 'Building packages in CommonJs mode...',
    callback: buildCommonJs,
    enabled: options => options.buildcommonjs,
};
