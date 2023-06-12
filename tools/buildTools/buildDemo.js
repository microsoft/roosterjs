'use strict';

const path = require('path');
const fs = require('fs');
const {
    rootPath,
    nodeModulesPath,
    packagesPath,
    deployPath,
    roosterJsDistPath,
    packagesUiPath,
    roosterJsUiDistPath,
    runWebPack,
    getWebpackExternalCallback,
} = require('./common');

async function buildDemoSite() {
    const sourcePathRoot = path.join(rootPath, 'demo');
    const sourcePath = path.join(sourcePathRoot, 'scripts');
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
                    options: {
                        compilerOptions: {
                            downlevelIteration: true,
                            importHelpers: true,
                        },
                    },
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
        externals: getWebpackExternalCallback([
            [/^roosterjs-editor-plugins\/.*$/, 'roosterjs'],
            [/^rosterjs-react\/.*$/, 'roosterjsReact'],
        ]),
        stats: 'minimal',
        mode: 'production',
        optimization: {
            minimize: true,
        },
    };

    await runWebPack(webpackConfig);

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
}

module.exports = {
    message: 'Building demo site...',
    callback: buildDemoSite,
    enabled: options => options.builddemo,
};
