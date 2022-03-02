'use strict';

const path = require('path');
const webpack = require('webpack');
const {
    packages,
    packagesPath,
    roosterJsDistPath,
    roosterJsUiDistPath,
    nodeModulesPath,
    packagesUiPath,
    rootPath,
} = require('./common');

const externalMap = new Map([
    ['react', 'React'],
    ['react-dom', 'ReactDOM'],
    ['office-ui-fabric-react', 'FluentUIReact'],
    [/^office-ui-fabric-react\/lib\/[^/]+$/, 'FluentUIReact'],
    ...packages.map(p => [p, 'roosterjs']),
]);

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
                        configFile: isUi ? 'tsconfig.json' : 'tsconfig.build.json',
                        compilerOptions: {
                            rootDir: rootPath,
                            strict: false,
                            declaration: false,
                        },
                    },
                },
            ],
        },
        externals: isUi
            ? function (_, request, callback) {
                  for (const [key, value] of externalMap) {
                      if (key instanceof RegExp && key.test(request)) {
                          return callback(null, request.replace(key, value));
                      } else if (request === key) {
                          return callback(null, value);
                      }
                  }

                  callback();
              }
            : undefined,
        stats: 'minimal',
        mode: isProduction ? 'production' : 'development',
        optimization: {
            minimize: isProduction,
        },
    };

    await new Promise((resolve, reject) => {
        webpack(webpackConfig).run((err, result) => {
            const compileErrors = result?.compilation?.errors || [];

            if (compileErrors.length > 0) {
                reject(compileErrors);
            } else if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
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
