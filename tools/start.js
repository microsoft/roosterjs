var webpack = require('webpack');
var webpackconfig = require('../webpack.config');
var webpackdevserver = require('webpack-dev-server');
var detect = require('detect-port');

function startWebpackDevServer() {
    port = webpackconfig.devServer.port;
    detect(port)
        .then(_port => {
            const devServerOptions = Object.assign({}, webpackconfig.devServer, {
                open: true,
                port: _port,
                public: 'localhost:' + _port,
                publicPath: '/scripts',
            });
            webpackconfig.devServer = devServerOptions;
            const compiler = webpack(webpackconfig);
            const server = new webpackdevserver(compiler, devServerOptions);
            server.listen(_port, '127.0.0.1', () => {});
        })
        .catch(err => {
            console.log(err);
        });
}

+startWebpackDevServer();
