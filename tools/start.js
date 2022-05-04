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
                public: 'localhost:' + _port,
                publicPath: '/scripts',
            });
            webpackConfig.devServer = devServerOptions;
            const compiler = webpack(webpackConfig);
            const server = new webpackDevServer(compiler, devServerOptions);
            server.listen(_port, '127.0.0.1', () => {});
        })
        .catch(err => {
            console.log(err);
        });
}

processConstEnum();
+startWebpackDevServer();
