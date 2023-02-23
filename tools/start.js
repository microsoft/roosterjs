var webpack = require('webpack');
var webpackConfig = require('../webpack.config');
var webpackDevServer = require('webpack-dev-server');
var detect = require('detect-port');
var processConstEnum = require('./buildTools/processConstEnum');

function startWebpackDevServer() {
    port = webpackConfig.devServer.port;
    detect(port)
        .then(_port => {
            const devServerOptions = Object.assign({}, webpackConfig.devServer, {
                open: true,
                port: _port,
                public: '0.0.0.0:' + _port,
                publicPath: '/scripts',
            });
            webpackConfig.devServer = devServerOptions;
            const compiler = webpack(webpackConfig);
            const server = new webpackDevServer(compiler, devServerOptions);
            server.listen(_port, '0.0.0.0', () => {});
        })
        .catch(err => {
            console.log(err);
        });
}

processConstEnum();
+startWebpackDevServer();
