'use strict';

const path = require('path');
const rimraf = require('rimraf');
const { distPath, compatibleEnumPath, contentModelCompatibleEnumPath } = require('./common');

async function cleanDir(dirName) {
    await new Promise((resolve, reject) => {
        rimraf(dirName, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

async function clean() {
    await cleanDir(distPath);
    await cleanDir(compatibleEnumPath);
    await cleanDir(contentModelCompatibleEnumPath);
}

module.exports = {
    message: 'Clearing destination folder...',
    callback: clean,
    enabled: options => options.clean,
};
