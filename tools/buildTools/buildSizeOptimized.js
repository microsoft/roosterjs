'use strict';

const fs = require('fs');
const path = require('path');
const {
    runNode,
    rootPath,
    nodeModulesPath,
    packages,
    packagesUI,
    tempPath,
    readPackageJson,
    packagesUiPath,
    distPath,
} = require('./common');

function processDir(packageRoot, packageName, subFolder) {
    const sourceDir = path.join(rootPath, packageRoot, packageName, 'lib', subFolder);
    const targetDir = path.join(tempPath, packageName, 'lib-const-enum', subFolder);
    const fileNames = fs.readdirSync(sourceDir);

    fileNames.forEach(fileName => {
        const fullName = path.join(sourceDir, fileName);
        const stats = fs.statSync(fullName);

        if (stats.isDirectory()) {
            processDir(packageRoot, packageName, subFolder + '/' + fileName);
        } else if (stats.isFile() && /\.tsx?$/.test(fullName)) {
            const content = fs.readFileSync(fullName).toString();
            const newContent = content.replace(/\/\*--const--\*\//g, 'const');
            const newFullName = path.join(targetDir, fileName);

            fs.mkdirSync(targetDir, { recursive: true });
            fs.writeFileSync(newFullName, newContent);
        }
    });
}

function processPackage(packageName, packageRoot) {
    processDir(packageRoot, packageName, '');

    const json = readPackageJson(packageName, true);
    json.main = './lib-const-enum/index.ts';
    fs.writeFileSync(
        path.join(tempPath, packageName, 'package.json'),
        JSON.stringify(json, null, 4)
    );

    const targetJson = readPackageJson(packageName);

    if (targetJson.exports) {
        Object.keys(targetJson.exports).forEach(key => {
            const item = targetJson.exports[key];

            targetJson.exports[key] = {
                roosterConstEnum: item.default.map(p => p.replace('/lib/', '/lib-const-enum/')),
                default: item.default,
            };
        });
    } else {
        targetJson.exports = {
            '.': {
                roosterConstEnum: ['./lib-const-enum/index.ts', './lib-const-enum/index.js'],
                default: ['./lib/index.ts', './lib/index.js'],
            },
        };
    }
    const targetJsonString = JSON.stringify(targetJson, null, 4);
    const targetPackageJsonFileName = path.join(distPath, packageName, 'package.json');
    fs.writeFileSync(targetPackageJsonFileName, targetJsonString);
}

function replaceConstEnum() {
    packages.forEach(packageName => {
        processPackage(packageName, 'packages');
    });

    packagesUI.forEach(packageName => {
        processPackage(packageName, 'packages-ui');
    });

    fs.copyFileSync(
        path.join(packagesUiPath, 'tsconfig.json'),
        path.join(tempPath, 'tsconfig.json')
    );
}

function buildSizeOptimized() {
    replaceConstEnum();

    const typescriptPath = path.join(nodeModulesPath, 'typescript/lib/tsc.js');

    runNode(typescriptPath, tempPath);
}

module.exports = {
    message: 'Building packages in Size Optimized mode...',
    callback: buildSizeOptimized,
    enabled: options => options.buildSizeOptimized,
};
