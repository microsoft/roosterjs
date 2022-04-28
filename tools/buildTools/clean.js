'use strict';

const rimraf = require('rimraf');
const { distPath, tempPath } = require('./common');

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
    await cleanDir(tempPath);
}

module.exports = {
    message: 'Clearing destination folder...',
    callback: clean,
    enabled: options => options.clean,
};
