'use strict';

const fs = require('fs');
const path = require('path');
const { nodeModulesPath, packagesPath, err } = require('./common');

const tsContent = `/**
 * Define DOM types of window, used by safeInstanceOf() to check if a given object is of the specified type of its own window
 *
 * !!!Note: This file is generated from /tools/generateTargetWindow.js. Do NOT modify this file directly!!!
 */
export default interface TargetWindowBase {
`;

function generateTargetWindow() {
    const libDomFilePath = path.join(nodeModulesPath, 'typescript/lib/lib.dom.d.ts');
    const typePath = path.join(packagesPath, 'roosterjs-editor-types');
    const targetPath = path.join(typePath, 'lib/interface/TargetWindowBase.g.ts');
    const packageJsonPath = path.join(typePath, 'package.json');

    if (!fs.existsSync(libDomFilePath)) {
        console.error(`Cannot find source file: ${libDomFilePath}`);
        return 1;
    }

    const source = fs.readFileSync(libDomFilePath).toString();
    const search = ['Node', 'Range'];

    let result = tsContent;

    while (search.length > 0) {
        const name = search.pop();
        result += `    ${name}: ${name};\r\n`;
        const reg = new RegExp(`^interface (\\w+) extends\\s?${name}( \\{$|,.*$)`, 'gm');
        let match;

        while ((match = reg.exec(source)) != null) {
            search.push(match[1]);
        }
    }

    result += '}\r\n';

    try {
        fs.writeFileSync(targetPath, result);
    } catch (e) {
        err(e);
    }
}

module.exports = {
    message: 'Generating TargetWindowBase.g.ts...',
    callback: generateTargetWindow,
    enabled: options => options.buildcommonjs || options.buildamd || options.buildmjs,
};
