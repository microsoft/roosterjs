const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const repoRoot = path.join(__dirname, '../../../../');
const config = require(path.join(repoRoot, 'webpack.config.js'));

module.exports = async function (puppeteer) {
    const webpackCompiler = webpack(config);
    const devserver = new WebpackDevServer(webpackCompiler, {
        publicPath: config.output.publicPath,
        contentBase: path.join(repoRoot),
    });
    devserver.listen(9090);

    await new Promise((resolve) => {
        webpackCompiler.hooks.afterEmit.tap('JestSetup', () => {
            resolve();
        })
    });

    global.__WEBPACK_DEVSERVER_GLOBAL__ = devserver;
};