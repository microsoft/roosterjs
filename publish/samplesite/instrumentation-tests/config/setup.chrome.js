const puppeteer = require('puppeteer');
const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');
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

    const [, browser] = await Promise.all([
        new Promise((resolve) => {
            webpackCompiler.hooks.afterEmit.tap('JestSetup', () => {
                resolve();
            })
        }),
        puppeteer.launch({ headless: process.env.RUN_WITH_DISPLAY != 'true' }),
    ]);

    // store the browser instance so we can teardown it later
    // this global is only available in the teardown but not in TestEnvironments
    global.__BROWSER_GLOBAL__ = browser;
    global.__WEBPACK_DEVSERVER_GLOBAL__ = devserver;

    // Chrome reuses the same puppeteer instance. create the websocket endpoint so that
    // the puppeteer_environment can connect to it.
    mkdirp.sync(CONSTANTS.CHROME_TEMP_DIR);
    fs.writeFileSync(path.join(CONSTANTS.CHROME_TEMP_DIR, 'wsEndpoint'), browser.wsEndpoint());
}