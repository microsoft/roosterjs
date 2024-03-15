'use strict';

const path = require('path');
const fs = require('fs');
const {
    rootPath,
    nodeModulesPath,
    packagesPath,
    deployPath,
    roosterJsDistPath,
    runWebPack,
    getWebpackExternalCallback,
    buildConfig,
} = require('./common');

const filesToCopy = Object.values(buildConfig).map(x => x.jsFileBaseName);

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
            modules: [sourcePath, packagesPath, nodeModulesPath],
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
            [/^roosterjs-editor-adapter\/.*$/, 'roosterjs'],
            [/^roosterjs-react\/.*$/, 'roosterjsReact'],
            [/^roosterjs-react$/, 'roosterjsReact'],
            [/^roosterjs-content-model.*/, 'roosterjsContentModel'],
            [/^roosterjs-adapter\/.*$/, 'roosterjsAdapter'],
        ]),
        stats: 'minimal',
        mode: 'production',
        optimization: {
            minimize: true,
        },
    };

    await runWebPack(webpackConfig);

    filesToCopy.forEach(file => {
        const source = path.resolve(roosterJsDistPath, `${file}-min.js`);
        const target = path.resolve(deployPath, `${file}-min.js`);

        fs.copyFileSync(source, target);
        fs.copyFileSync(source + '.map', target + '.map');
    });

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
