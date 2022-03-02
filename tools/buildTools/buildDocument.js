'use strict';

const path = require('path');
const { rootPath, nodeModulesPath, runNode } = require('./common');

function buildDocument() {
    const config = {
        tsconfig: path.join(rootPath, 'tools', 'tsconfig.doc.json'),
    };
    let cmd = path.join(nodeModulesPath, 'typedoc/bin/typedoc');

    for (let key of Object.keys(config)) {
        let value = config[key];
        cmd += ` --${key} ${value}`;
    }

    runNode(cmd, rootPath, 'pipe');
}

module.exports = {
    message: 'Building documents...',
    callback: buildDocument,
    enabled: options => options.builddoc,
};
