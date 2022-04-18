'use strict';

const {
    packages,
    packagesUI,
    rootPath,
    readPackageJson,
    mainPackageJson,
    err,
} = require('./common');
const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const fileNames = fs.readdirSync(dir);

    fileNames.forEach(fileName => {
        const fullName = path.join(dir, fileName);
        const stats = fs.statSync(fullName);

        if (stats.isDirectory()) {
            processDir(fullName);
        } else if (stats.isFile() && /\.tsx?$/.test(fullName)) {
            const content = fs.readFileSync(fullName).toString();
            const newContent = content.replace(/\/\*--const--\*\//g, 'const');

            if (content != newContent) {
                fs.writeFileSync(fullName, newContent);
            }
        }
    });
}

function processPackage(p, parentPath) {
    const [json, writeBack] = readPackageJson(p, true);
    const ver = json.version || mainPackageJson.version;

    if (/^\d+\.\d+\.\d+$/.test(ver)) {
        json.version = ver + '-size-optimized.0';
        writeBack(JSON.stringify(json, null, 4));

        processDir(path.join(rootPath, parentPath, p, 'lib'));
    } else {
        err(`Cannot replace const enum for package ${p}@${ver}`);
    }
}

function replaceConstEnum() {
    packages.forEach(p => {
        processPackage(p, 'packages');
    });

    packagesUI.forEach(p => {
        processPackage(p, 'packages-ui');
    });
}

module.exports = {
    message: 'Replacing enum with const enum...',
    callback: replaceConstEnum,
    enabled: options => options.replaceConstEnum,
};
