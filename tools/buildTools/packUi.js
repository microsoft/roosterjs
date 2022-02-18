'use strict';

const path = require('path');
const webpack = require('webpack');
const {
    packages,
    packagesPath,
    packagesUiPath,
    distPath,
    nodeModulesPath,
    rootPath,
} = require('./common');
const externalMap = new Map([
    ['react', 'React'],
    // ['office-ui-fabric-react', 'OfficeFabric'],
    // [/^office-ui-fabric-react\/lib\/([^/]+)$/, 'OfficeFabric/$1'],
    // [/^office-ui-fabric-react\/lib\/components\/([^/]+)$/, 'OfficeFabric/components/$1/$1'],
    ...packages.map(p => [p, 'roosterjs']),
]);

async function pack(isProduction, isAmd, filename) {
    const webpackConfig = {
        entry: path.join(packagesUiPath, 'roosterjs-react/lib/index.ts'),
        devtool: 'source-map',
        output: {
            filename,
            path: path.join(distPath, 'roosterjs-react/dist'),
            libraryTarget: isAmd ? 'amd' : undefined,
            library: isAmd ? undefined : 'roosterjsReact',
        },
        resolve: {
            extensions: ['.ts', '.js', '.tsx'],
            modules: [packagesUiPath, packagesPath, nodeModulesPath],
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    options: {
                        configFile: 'tsconfig.json',
                        compilerOptions: {
                            rootDir: rootPath,
                            strict: false,
                            declaration: false,
                        },
                    },
                },
            ],
        },
        externals: function (context, request, callback) {
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
    const fileName = `rooster-react${isAmd ? '-amd' : ''}${isProduction ? '-min' : ''}.js`;
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
