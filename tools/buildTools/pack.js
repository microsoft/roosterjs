'use strict';

const path = require('path');
const webpack = require('webpack');
const { packagesPath, roosterJsDistPath, nodeModulesPath } = require('./common');

async function pack(isProduction, isAmd, filename) {
    const webpackConfig = {
        entry: path.join(packagesPath, 'roosterjs/lib/index.ts'),
        devtool: 'source-map',
        output: {
            filename,
            path: roosterJsDistPath,
            libraryTarget: isAmd ? 'amd' : undefined,
            library: isAmd ? undefined : 'roosterjs',
        },
        resolve: {
            extensions: ['.ts', '.js'],
            modules: [packagesPath, nodeModulesPath],
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: 'ts-loader',
                    options: {
                        configFile: 'tsconfig.build.json',
                    },
                },
            ],
        },
        stats: 'minimal',
        mode: isProduction ? 'production' : 'development',
        optimization: {
            minimize: isProduction,
        },
    };

    await new Promise((resolve, reject) => {
        webpack(webpackConfig).run(err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function createStep(isProduction, isAmd) {
    const fileName = `rooster${isAmd ? '-amd' : ''}${isProduction ? '-min' : ''}.js`;
    return {
        message: `Packing ${fileName}...`,
        callback: async () => pack(isProduction, isAmd, fileName),
        enabled: options => (isProduction ? options.packprod : options.pack),
    };
}

module.exports = {
    commonJsDebug: createStep(false, false),
    commonJsProduction: createStep(true, false),
    amdDebug: createStep(false, true),
    amdProduction: createStep(true, true),
};
