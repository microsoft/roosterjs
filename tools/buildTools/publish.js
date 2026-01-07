'use strict';

const path = require('path');
const exec = require('child_process').execSync;
const { distPath, readPackageJson, packages } = require('./common');

const VersionRegex = /\d+\.\d+\.\d+(-([^\.]+)(\.\d+)?)?/;

function publish() {
    packages.forEach(packageName => {
        const json = readPackageJson(packageName, false /*readFromSourceFolder*/);
        const localVersion = json.version;
        const versionMatch = VersionRegex.exec(localVersion);
        const tagname = (versionMatch && versionMatch[2]) || 'latest';
        let npmVersion = '';

        try {
            npmVersion = exec(`npm view ${packageName}@${tagname} version`).toString().trim();
        } catch (e) {}

        if (!localVersion || localVersion == '0.0.0') {
            console.log(
                `Skip publishing package ${packageName}, because version (${localVersion}) is not ready to publish`
            );
        } else if (localVersion == npmVersion) {
            console.log(
                `Skip publishing package ${packageName}, because version (${npmVersion}) is not changed`
            );
        } else {
            try {
                const basePublishString = `npm publish`;
                const publishString = basePublishString + ` --tag ${tagname}`;
                exec(publishString, {
                    env: {
                        ...process.env,
                    },
                    stdio: 'inherit',
                    cwd: path.join(distPath, packageName),
                });
            } catch (e) {
                // Do not treat publish failure as build failure
                console.log(e);
            }
        }
    });
}

module.exports = {
    message: 'Publishing to npm...',
    callback: publish,
    enabled: options => options.publish,
};
