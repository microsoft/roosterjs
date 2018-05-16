const devServerPort = 3000;

module.exports = {
    entry: './sample/scripts/sample.ts',
    devtool: 'source-map',
    output: {
        filename: 'sample.js',
        path: __dirname + '/sample/scripts',
        publicPath: '/sample/scripts/',
        sourceMapFilename: '[name].map'
    },
    resolve: {
        extensions: ['.ts', '.js'],
        modules: [
            './packages',
            './node_modules'
        ]
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    },
    watch: true,
    stats: "minimal",
    devServer: {
        host: "0.0.0.0", // This makes the server public so that others can test by http://hostname ...
        port: devServerPort,
        open: true,
        openPage: "sample/sample.htm",
        public: "localhost:" + devServerPort
    }
};
