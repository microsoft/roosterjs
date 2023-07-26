'use strict';

const fs = require('fs');
const path = require('path');
const {
    runNode,
    nodeModulesPath,
    packagesPath,
    packagesUiPath,
    packagesContentModelPath,
} = require('./common');

function buildTest() {
    const typescriptPath = path.join(nodeModulesPath, 'typescript/lib/tsc.js');

    runNode(
        typescriptPath +
            ` -p ${path.join(
                packagesPath,
                'tsconfig.test.json'
            )} -t es5 --moduleResolution node -m commonjs`
    );
    runNode(
        typescriptPath +
            ` -p ${path.join(
                packagesUiPath,
                'tsconfig.test.json'
            )} -t es5 --moduleResolution node -m commonjs`
    );
    runNode(
        typescriptPath +
            ` -p ${path.join(
                packagesContentModelPath,
                'tsconfig.test.json'
            )} -t es5 --moduleResolution node -m commonjs`
    );
}

module.exports = {
    message: 'Building test code.',
    callback: buildTest,
    enabled: options => options.buildtest,
};
