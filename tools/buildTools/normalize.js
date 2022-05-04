'use strict';

const path = require('path');
const mkdirp = require('mkdirp');
const fs = require('fs');
const {
    rootPath,
    packages,
    allPackages,
    distPath,
    compatibleEnumPath,
    readPackageJson,
    mainPackageJson,
    err,
} = require('./common');

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

function generateCompatibleEnumScript(enums, fileName) {
    return enums.map(generateCompatibleEnum).join('\r\n');
}

function processConstEnum() {
    const sourceDir = path.join(rootPath, 'packages', 'roosterjs-editor-types', 'lib', 'enum');
    const fileNames = fs.readdirSync(sourceDir);
    let indexTs = '';

    fileNames.forEach(fileName => {
        const fullName = path.join(sourceDir, fileName);
        const content = fs.readFileSync(fullName).toString();
        const enums = parseEnum(content);

        if (enums.length > 0) {
            const newContent = generateCompatibleEnumScript(enums, fileName);

            indexTs += `export { ${enums
                .map(e => `${CompatibleTypePrefix}${e.name}`)
                .join(', ')} } from './${fileName.replace(/\.ts$/, '')}'\r\n`;

            const newFullName = path.join(compatibleEnumPath, fileName);

            fs.mkdirSync(compatibleEnumPath, { recursive: true });
            fs.writeFileSync(newFullName, newContent);
        }
    });

    if (indexTs) {
        fs.writeFileSync(path.join(compatibleEnumPath, 'index.ts'), indexTs);
    }
}

function normalize() {
    const knownCustomizedPackages = {};

    allPackages.forEach(packageName => {
        const packageJson = readPackageJson(packageName, true /*readFromSourceFolder*/);

        Object.keys(packageJson.dependencies).forEach(dep => {
            if (packageJson.dependencies[dep]) {
                // No op, keep the specified value
            } else if (knownCustomizedPackages[dep]) {
                packageJson.dependencies[dep] = knownCustomizedPackages[dep];
            } else if (packages.indexOf(dep) > -1) {
                packageJson.dependencies[dep] = mainPackageJson.version;
            } else if (mainPackageJson.dependencies && mainPackageJson.dependencies[dep]) {
                packageJson.dependencies[dep] = mainPackageJson.dependencies[dep];
            } else if (!packageJson.dependencies[dep]) {
                err('there is a missing dependency in the main package.json: ' + dep);
            }
        });

        if (packageJson.version) {
            knownCustomizedPackages[packageName] = packageJson.version;
        } else {
            packageJson.version = mainPackageJson.version;
        }

        packageJson.typings = './lib/index.d.ts';
        packageJson.main = './lib/index.js';
        packageJson.license = 'MIT';
        packageJson.repository = {
            type: 'git',
            url: 'https://github.com/Microsoft/roosterjs',
        };

        const targetPackagePath = path.join(distPath, packageName);
        const targetFileName = path.join(targetPackagePath, 'package.json');
        mkdirp.sync(targetPackagePath);
        fs.writeFileSync(targetFileName, JSON.stringify(packageJson, null, 4));
    });

    processConstEnum();
}

module.exports = {
    message: 'Normalizing packages...',
    callback: normalize,
    enabled: options => options.normalize,
};
