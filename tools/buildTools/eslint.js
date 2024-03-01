'use strict';

const path = require('path');
const { nodeModulesPath, runNode, packagesPath, rootPath } = require('./common');

function eslint() {
    const eslintPath = path.join(nodeModulesPath, 'eslint/bin/eslint.js');
    runNode(
        eslintPath + ' -c ' + path.join(rootPath, '.eslintrc.js') + ' ./**/lib/**/*.{ts,tsx}',
        packagesPath
    );
}

module.exports = {
    message: 'Running eslint...',
    callback: eslint,
    enabled: options => options.eslint,
};
