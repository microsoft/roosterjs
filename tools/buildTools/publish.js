'use strict';

const path = require('path');
const fs = require('fs');
const exec = require('child_process').execSync;
const { rootPath, distPath, readPackageJson, packages } = require('./common');

const VersionRegex = /\d+\.\d+\.\d+(-([^\.]+)(\.\d+)?)?/;

function publish(options) {
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
            const rootNpmrcName = path.join(rootPath, '.npmrc');
            const targetNpmrcName = path.join(distPath, packageName, '.npmrc');

            if (fs.existsSync(rootNpmrcName)) {
                console.log(`Copying .npmrc to ${packageName} folder`);
                fs.copyFileSync(rootNpmrcName, targetNpmrcName);
            }

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
            } finally {
                if (fs.existsSync(targetNpmrcName)) {
                    fs.unlinkSync(targetNpmrcName);
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
