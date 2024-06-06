'use strict';

const {
    packagesPath,
    nodeModulesPath,
    rootPath,
    runWebPack,
    buildConfig,
    roosterJsDistPath,
} = require('./common');
const path = require('path');

async function pack(isProduction, isAmd, target, filename) {
    const { entry, libraryName, externalHandler } = buildConfig[target];
    const webpackConfig = {
        entry: path.join(packagesPath, entry, 'lib/index.ts'),
        devtool: 'source-map',
        output: {
            filename,
            path: roosterJsDistPath,
            libraryTarget: isAmd ? 'amd' : undefined,
            library: isAmd ? undefined : libraryName,
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
            modules: [packagesPath, nodeModulesPath],
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
                            declaration: false,
                            downlevelIteration: true,
                            importHelpers: true,
                        },
                    },
                },
            ],
        },
        externals: externalHandler,
        stats: 'minimal',
        mode: isProduction ? 'production' : 'development',
        optimization: {
            minimize: isProduction,
        },
    };

    await runWebPack(webpackConfig);
}

function createStep(isProduction, isAmd, target) {
    const fileName = `${buildConfig[target].jsFileBaseName}${isAmd ? '-amd' : ''}${
        isProduction ? '-min' : ''
    }.js`;
    return {
        message: `Packing ${fileName}...`,
        callback: async () => pack(isProduction, isAmd, target, fileName),
        enabled: options =>
            (options.builddemo && isProduction && !isAmd) ||
            (isProduction ? options.packprod : options.pack),
    };
}

module.exports = {
    // commonJsDebugUi: createStep(false /*isProduction*/, false /*isAmd*/, 'react'),
    // commonJsProdUi: createStep(true /*isProduction*/, false /*isAmd*/, 'react'),
    // amdDebugUi: createStep(false /*isProduction*/, true /*isAmd*/, 'react'),
    // amdProductionUi: createStep(true /*isProduction*/, true /*isAmd*/, 'react'),

    commonJsDebugMain: createStep(false /*isProduction*/, false /*isAmd*/, 'main'),
    commonJsProdMain: createStep(true /*isProduction*/, false /*isAmd*/, 'main'),
    amdDebugMain: createStep(false /*isProduction*/, true /*isAmd*/, 'main'),
    amdProdMain: createStep(true /*isProduction*/, true /*isAmd*/, 'main'),

    commonJsDebugAdapter: createStep(false /*isProduction*/, false /*isAmd*/, 'legacyAdapter'),
    commonJsProdAdapter: createStep(true /*isProduction*/, false /*isAmd*/, 'legacyAdapter'),
    amdDebugAdapter: createStep(false /*isProduction*/, true /*isAmd*/, 'legacyAdapter'),
    amdProdAdapter: createStep(true /*isProduction*/, true /*isAmd*/, 'legacyAdapter'),
};
