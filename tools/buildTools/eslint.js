'use strict';

const path = require('path');
const {
    nodeModulesPath,
    runNode,
    packagesPath,
    packagesUiPath,
    packagesContentModelPath,
    rootPath,
} = require('./common');

function eslint() {
    const eslintPath = path.join(nodeModulesPath, 'eslint/bin/eslint.js');
    [packagesPath, packagesUiPath, packagesContentModelPath].forEach(p => {
        runNode(
            eslintPath + ' -c ' + path.join(rootPath, '.eslintrc.js') + ' ./**/lib/**/*.{ts,tsx}',
            p
        );
    });
}

module.exports = {
    message: 'Running eslint...',
    callback: eslint,
    enabled: options => options.eslint,
};
