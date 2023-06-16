'use strict';

const path = require('path');
const {
    packagesPath,
    roosterJsDistPath,
    roosterJsUiDistPath,
    nodeModulesPath,
    packagesUiPath,
    rootPath,
    runWebPack,
    getWebpackExternalCallback,
} = require('./common');

async function pack(isProduction, isAmd, isUi, filename) {
    const webpackConfig = {
        entry: isUi
            ? path.join(packagesUiPath, 'roosterjs-react/lib/index.ts')
            : path.join(packagesPath, 'roosterjs/lib/index.ts'),
        devtool: 'source-map',
        output: {
            filename,
            path: isUi ? roosterJsUiDistPath : roosterJsDistPath,
            libraryTarget: isAmd ? 'amd' : undefined,
            library: isAmd ? undefined : isUi ? 'roosterjsReact' : 'roosterjs',
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
            modules: [packagesPath, packagesUiPath, nodeModulesPath],
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
        externals: isUi ? getWebpackExternalCallback([]) : undefined,
        stats: 'minimal',
        mode: isProduction ? 'production' : 'development',
        optimization: {
            minimize: isProduction,
        },
    };

    await runWebPack(webpackConfig);
}

function createStep(isProduction, isAmd, isUi) {
    const fileName = `rooster${isUi ? '-react' : ''}${isAmd ? '-amd' : ''}${
        isProduction ? '-min' : ''
    }.js`;
    return {
        message: `Packing ${fileName}...`,
        callback: async () => pack(isProduction, isAmd, isUi, fileName),
        enabled: options => (isProduction ? options.packprod : options.pack),
    };
}

module.exports = {
    commonJsDebug: createStep(false /*isProduction*/, false /*isAmd*/, false /*isUi*/),
    commonJsProduction: createStep(true /*isProduction*/, false /*isAmd*/, false /*isUi*/),
    amdDebug: createStep(false /*isProduction*/, true /*isAmd*/, false /*isUi*/),
    amdProduction: createStep(true /*isProduction*/, true /*isAmd*/, false /*isUi*/),
    commonJsDebugUi: createStep(false /*isProduction*/, false /*isAmd*/, true /*isUi*/),
    commonJsProductionUi: createStep(true /*isProduction*/, false /*isAmd*/, true /*isUi*/),
    amdDebugUi: createStep(false /*isProduction*/, true /*isAmd*/, true /*isUi*/),
    amdProductionUi: createStep(true /*isProduction*/, true /*isAmd*/, true /*isUi*/),
};
