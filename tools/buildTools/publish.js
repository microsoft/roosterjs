'use strict';

const path = require('path');
const fs = require('fs');
const exec = require('child_process').execSync;
const { allPackages, distPath, readPackageJson } = require('./common');

const VersionRegex = /\d+\.\d+\.\d+(-([^\.]+)(\.\d+)?)?/;
const NpmrcContent = 'registry=https://registry.npmjs.com/\n//registry.npmjs.com/:_authToken=';

function publish(options) {
    allPackages.forEach(packageName => {
        const json = readPackageJson(packageName, false /*readFromSourceFolder*/);
        const localVersion = json.version;
        const versionMatch = VersionRegex.exec(localVersion);
        const tagname = (versionMatch && versionMatch[2]) || 'latest';
        let npmVersion = '';

        try {
            npmVersion = exec(`npm view ${packageName}@${tagname} version`).toString().trim();
        } catch (e) {}

        if (localVersion == '0.0.0') {
            console.log(
                `Skip publishing package ${packageName}, because version (${localVersion}) is not ready to publish`
            );
        } else if (localVersion == npmVersion) {
            console.log(
                `Skip publishing package ${packageName}, because version (${npmVersion}) is not changed`
            );
        } else {
            let npmrcName = path.join(distPath, packageName, '.npmrc');
            if (options.token) {
                const npmrc = `${NpmrcContent}${options.token}\n`;
                fs.writeFileSync(npmrcName, npmrc);
            }

            try {
                const basePublishString = `npm publish`;
                const publishString = basePublishString + ` --tag ${tagname}`;
                exec(publishString, {
                    stdio: 'inherit',
                    cwd: path.join(distPath, packageName),
                });
            } catch (e) {
                // Do not treat publish failure as build failure
                console.log(e);
            } finally {
                if (options.token) {
                    fs.unlinkSync(npmrcName);
                }
            }
        }
    });
}

module.exports = {
    message: 'Publishing to npm...',
    callback: publish,
    enabled: options => options.publish,
};
