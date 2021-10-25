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
} = require('./common');

async function buildDemoSite() {
    const sourcePathRoot = path.join(rootPath, 'demo');
    const sourcePath = path.join(sourcePathRoot, 'scripts');
    const typescriptPath = path.join(nodeModulesPath, 'typescript/lib/tsc.js');

    runNode(typescriptPath + ' --noEmit ', sourcePath);

    const distPathRoot = path.join(deployPath);
    const filename = 'demo.js';
    const webpackConfig = {
        entry: path.join(sourcePath, 'index.ts'),
        devtool: 'source-map',
        output: {
            filename,
            path: distPathRoot,
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.svg', '.scss', '.'],
            modules: [sourcePath, packagesPath, nodeModulesPath],
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
        externals: packages.reduce(
            (externals, packageName) => {
                externals[packageName] = 'roosterjs';
                return externals;
            },
            {
                react: 'React',
                'react-dom': 'ReactDOM',
            }
        ),
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
                    path.resolve(distPathRoot, 'rooster-min.js')
                );
                fs.copyFileSync(
                    path.resolve(roosterJsDistPath, 'rooster-min.js.map'),
                    path.resolve(distPathRoot, 'rooster-min.js.map')
                );
                fs.copyFileSync(
                    path.resolve(sourcePathRoot, 'index.html'),
                    path.resolve(distPathRoot, 'index.html')
                );
                var outputFilename = path.join(distPathRoot, filename);
                fs.writeFileSync(
                    outputFilename,
                    `window.roosterJsVer = "v${mainPackageJson.version}";` +
                        fs.readFileSync(outputFilename).toString()
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
