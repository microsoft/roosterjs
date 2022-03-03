'use strict';

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const {
    rootPath,
    nodeModulesPath,
    packagesPath,
    deployPath,
    roosterJsDistPath,
    packages,
    runNode,
    mainPackageJson,
    packagesUiPath,
    roosterJsUiDistPath,
} = require('./common');

const externalMap = new Map([
    ...packages.map(p => [p, 'roosterjs']),
    [/^roosterjs-editor-plugins\/.*$/, 'roosterjs'],
    [/^rosterjs-react\/.*$/, 'roosterjsReact'],
    ['react', 'React'],
    ['react-dom', 'ReactDOM'],
    [/^office-ui-fabric-react(\/.*)?$/, 'FluentUIReact'],
    [/^@fluentui(\/.*)?$/, 'FluentUIReact'],
]);

async function buildDemoSite() {
    const sourcePathRoot = path.join(rootPath, 'demo');
    const sourcePath = path.join(sourcePathRoot, 'scripts');
    const typescriptPath = path.join(nodeModulesPath, 'typescript/lib/tsc.js');

    runNode(typescriptPath + ' --noEmit ', sourcePath);

    const filename = 'demo.js';
    const webpackConfig = {
        entry: path.join(sourcePath, 'index.ts'),
        devtool: 'source-map',
        output: {
            filename,
            path: deployPath,
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.svg', '.scss', '.'],
            modules: [sourcePath, packagesPath, packagesUiPath, nodeModulesPath],
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                },
                {
                    test: /\.svg$/,
                    loader: 'url-loader',
                    options: {
                        mimetype: 'image/svg+xml',
                        esModule: false,
                    },
                },
                {
                    test: /\.scss$/,
                    use: [
                        '@microsoft/loader-load-themed-styles',
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                            },
                        },
                        'sass-loader',
                    ],
                },
            ],
        },
        externals: function (_, request, callback) {
            for (const [key, value] of externalMap) {
                if (key instanceof RegExp && key.test(request)) {
                    return callback(null, request.replace(key, value));
                } else if (request === key) {
                    return callback(null, value);
                }
            }

            callback();
        },
        stats: 'minimal',
        mode: 'production',
        optimization: {
            minimize: true,
        },
    };

    await new Promise((resolve, reject) => {
        webpack(webpackConfig).run(err => {
            if (err) {
                reject(err);
            } else {
                fs.copyFileSync(
                    path.resolve(roosterJsDistPath, 'rooster-min.js'),
                    path.resolve(deployPath, 'rooster-min.js')
                );
                fs.copyFileSync(
                    path.resolve(roosterJsDistPath, 'rooster-min.js.map'),
                    path.resolve(deployPath, 'rooster-min.js.map')
                );
                fs.copyFileSync(
                    path.resolve(roosterJsUiDistPath, 'rooster-react-min.js'),
                    path.resolve(deployPath, 'rooster-react-min.js')
                );
                fs.copyFileSync(
                    path.resolve(roosterJsUiDistPath, 'rooster-react-min.js.map'),
                    path.resolve(deployPath, 'rooster-react-min.js.map')
                );
                fs.copyFileSync(
                    path.resolve(sourcePathRoot, 'index.html'),
                    path.resolve(deployPath, 'index.html')
                );
                var outputFilename = path.join(deployPath, 'version.js');
                fs.writeFileSync(
                    outputFilename,
                    `window.roosterJsVer = "v${mainPackageJson.version}";`
                );
                resolve();
            }
        });
    });
}

module.exports = {
    message: 'Building demo site...',
    callback: buildDemoSite,
    enabled: options => options.builddemo,
};
