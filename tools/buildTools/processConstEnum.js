'use strict';

const path = require('path');
const fs = require('fs');
const { compatibleEnumPath } = require('./common');

const EnumRegex = /(^\s*\/\*(?:\*(?!\/)|[^*])*\*\/)?\W*export const enum ([A-Za-z0-9]+)\s{([^}]+)}/gm;
const CompatibleTypePrefix = 'Compatible';

function parseEnum(source) {
    const enums = [];

    let enumMatch;
    while (!!(enumMatch = EnumRegex.exec(source))) {
        const enumComment = enumMatch[1] || '';
        const enumName = enumMatch[2];
        const enumContent = enumMatch[3];
        const currentEnum = {
            name: enumName,
            comment: enumComment,
            content: enumContent,
        };

        enums.push(currentEnum);
    }

    return enums;
}

function generateCompatibleEnum(currentEnum) {
    const enumName = currentEnum.name;
    return `${currentEnum.comment}\r\nexport enum ${CompatibleTypePrefix}${enumName} {\r\n${currentEnum.content}}\r\n`;
}

function generateCompatibleEnumScript(enums) {
    return enums.map(generateCompatibleEnum).join('\r\n');
}

function processConstEnumInternal(targetPath) {
    const sourceDir = targetPath.replace('compatibleEnum', 'enum');
    const fileNames = fs.readdirSync(sourceDir);
    let indexTs = '';

    fileNames.forEach(fileName => {
        const fullName = path.join(sourceDir, fileName);
        const content = fs.readFileSync(fullName).toString();
        const enums = parseEnum(content);

        if (enums.length > 0) {
            const newContent = generateCompatibleEnumScript(enums);

            indexTs += `export { ${enums
                .map(e => `${CompatibleTypePrefix}${e.name}`)
                .join(', ')} } from './${fileName.replace(/\.ts$/, '')}'\r\n`;

            const newFullName = path.join(targetPath, fileName);

            fs.mkdirSync(targetPath, { recursive: true });
            fs.writeFileSync(newFullName, newContent);
        }
    });

    if (indexTs) {
        fs.writeFileSync(path.join(targetPath, 'index.ts'), indexTs);
    }
}

function processConstEnum() {
    processConstEnumInternal(compatibleEnumPath);
}

module.exports = processConstEnum;
