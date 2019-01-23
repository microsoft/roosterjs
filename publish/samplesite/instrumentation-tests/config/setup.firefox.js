const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const CONSTANTS = require('./constants');

const repoRoot = path.join(__dirname, '../../../../');
const config = require(path.join(repoRoot, 'webpack.config.js'));

module.exports = async function () {
    const webpackCompiler = webpack(config);
    const devserver = new WebpackDevServer(webpackCompiler, {
        publicPath: config.output.publicPath,
        contentBase: path.join(repoRoot),
    });
    devserver.listen(CONSTANTS.DEVSERVER_PORT);

    await new Promise((resolve) => {
        webpackCompiler.hooks.afterEmit.tap('JestSetup', () => {
            resolve();
        })
    });

    global.__WEBPACK_DEVSERVER_GLOBAL__ = devserver;
};