'use strict';

const rimraf = require('rimraf');
const { distPath } = require('./common');

async function clean() {
    await new Promise((resolve, reject) => {
        rimraf(distPath, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

module.exports = {
    message: 'Clearing destination folder...',
    callback: clean,
    enabled: options => options.clean,
};
