'use strict';

const {
    packagesPath,
    nodeModulesPath,
    packagesUiPath,
    rootPath,
    runWebPack,
    buildConfig,
    packagesContentModelPath,
} = require('./common');

async function pack(isProduction, isAmd, target, filename) {
    const { packEntry, targetPath, libraryName, externalHandler } = buildConfig[target];
    const webpackConfig = {
        entry: packEntry,
        devtool: 'source-map',
        output: {
            filename,
            path: targetPath,
            libraryTarget: isAmd ? 'amd' : undefined,
            library: isAmd ? undefined : libraryName,
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
            modules: [packagesPath, packagesUiPath, packagesContentModelPath, nodeModulesPath],
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
        enabled: options => (isProduction ? options.packprod : options.pack),
    };
}

module.exports = {
    commonJsDebug: createStep(false /*isProduction*/, false /*isAmd*/, 'packages'),
    commonJsProduction: createStep(true /*isProduction*/, false /*isAmd*/, 'packages'),
    amdDebug: createStep(false /*isProduction*/, true /*isAmd*/, 'packages'),
    amdProduction: createStep(true /*isProduction*/, true /*isAmd*/, 'packages'),
    commonJsDebugUi: createStep(false /*isProduction*/, false /*isAmd*/, 'packages-ui'),
    commonJsProductionUi: createStep(true /*isProduction*/, false /*isAmd*/, 'packages-ui'),
    amdDebugUi: createStep(false /*isProduction*/, true /*isAmd*/, 'packages-ui'),
    amdProductionUi: createStep(true /*isProduction*/, true /*isAmd*/, 'packages-ui'),
    commonJsDebugContentModel: createStep(
        false /*isProduction*/,
        false /*isAmd*/,
        'packages-content-model'
    ),
    commonJsProductionContentModel: createStep(
        true /*isProduction*/,
        false /*isAmd*/,
        'packages-content-model'
    ),
    amdDebugContentModel: createStep(
        false /*isProduction*/,
        true /*isAmd*/,
        'packages-content-model'
    ),
    amdProductionContentModel: createStep(
        true /*isProduction*/,
        true /*isAmd*/,
        'packages-content-model'
    ),
};
