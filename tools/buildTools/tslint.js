'use strict';

const path = require('path');
const { rootPath, nodeModulesPath, runNode } = require('./common');

function tslint() {
    const tslintPath = path.join(nodeModulesPath, 'tslint/bin/tslint');
    const projectPath = path.join(rootPath, 'tools/tsconfig.tslint.json');
    runNode(tslintPath + ' --project ' + projectPath, rootPath);
}

module.exports = {
    message: 'Running tslint...',
    callback: tslint,
    enabled: options => options.tslint,
};
