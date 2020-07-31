const fs = require('fs');
const path = require('path');
const libDomFilePath = path.join(__dirname, '../node_modules/typescript/lib/lib.dom.d.ts');
const crossWindowPath = path.join(__dirname, '../packages/roosterjs-editor-types');
const targetPath = path.join(crossWindowPath, 'lib/interface/TargetWindow.ts');
const packageJsonPath = path.join(crossWindowPath, 'package.json');

if (!fs.existsSync(libDomFilePath)) {
    console.error(`Cannot find source file: ${libDomFilePath}`);
    return 1;
}

const source = fs.readFileSync(libDomFilePath).toString();
const search = ['Node', 'Range'];

let result = '/**\n';
result +=
    ' * Define DOM types of window, used by safeInstanceOf() to check if a given object is of the specified type of its own window\n';
result += ' *\n';
result +=
    ' * !!!Note: This file is generated from /tools/generateTargetWindow.js. Do NOT modify this file directly!!!\n';
result += ' */\n';
result += 'export default interface TargetWindow {\n';

while (search.length > 0) {
    const name = search.pop();
    result += `    ${name}: ${name};\n`;
    const reg = new RegExp(`^interface (\\w+) extends\\s?${name}( \\{$|,.*$)`, 'gm');
    let match;

    while ((match = reg.exec(source)) != null) {
        search.push(match[1]);
    }
}

result += '}\n';

try {
    fs.writeFileSync(targetPath, result);
    console.log(
        `\nSuccessfully generated target file ${targetPath}.\n\nRemember to change package version in ${packageJsonPath}.`
    );
} catch (e) {
    console.error(e);
    return 1;
}
