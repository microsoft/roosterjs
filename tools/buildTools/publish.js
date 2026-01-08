'use strict';

const path = require('path');
const fs = require('fs');
const exec = require('child_process').execSync;
const { rootPath, distPath, readPackageJson, packages } = require('./common');

const VersionRegex = /\d+\.\d+\.\d+(-([^\.]+)(\.\d+)?)?/;
const NpmrcContent = 'registry=https://registry.npmjs.com/\n//registry.npmjs.com/:_authToken=';

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
            const rootNpmrc = path.join(rootPath, '.npmrc');
            let NODE_AUTH_TOKEN = '';
            if (fs.existsSync(rootNpmrc)) {
                const lines = fs.readFileSync(rootNpmrc, 'utf-8').split('\n');
                for (const line of lines) {
                    console.log(line);
                    if (line.startsWith('//registry.npmjs.com/:_authToken=')) {
                        NODE_AUTH_TOKEN = line
                            .replace('//registry.npmjs.com/:_authToken=', '')
                            .trim();
                        break;
                    }
                }
            }

            console.log(
                `Publishing package ${packageName}, version ${localVersion}, tag ${tagname}...`
            );
            console.log(`npm view ${packageName}@${tagname} version: ${npmVersion}`);
            console.log(`Local version: ${localVersion}`);
            console.log(
                `Token: ${NODE_AUTH_TOKEN ? '***' + NODE_AUTH_TOKEN.slice(-4) : '(not found)'}`
            );

            const targetNpmrc = path.join(distPath, packageName, '.npmrc');

            const npmrc = `${NpmrcContent}${NODE_AUTH_TOKEN}\n`;
            fs.writeFileSync(targetNpmrc, npmrc);

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
                if (fs.existsSync(targetNpmrc)) {
                    fs.unlinkSync(targetNpmrc);
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
