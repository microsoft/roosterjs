const devServerPort = 3000;

module.exports = {
    entry: './publish/samplesite/scripts/sample.ts',
    devtool: 'source-map',
    output: {
        filename: 'sample.js',
        path: __dirname + '/publish/samplesite/scripts',
        publicPath: '/publish/samplesite/scripts/',
        sourceMapFilename: '[name].map'
    },
    resolve: {
        extensions: ['.ts', '.js'],
        modules: [
            './packages',
            './node_modules'
        ]
    },
    mode: 'development',
    module: {
        rules: [{
            test: /\.ts$/,
            loader: 'ts-loader'
        }]
    },
    watch: true,
    stats: "minimal",
    devServer: {
        host: "0.0.0.0", // This makes the server public so that others can test by http://hostname ...
        port: devServerPort,
        open: true,
        openPage: "publish/samplesite/sample.htm",
        public: "localhost:" + devServerPort
    }
};
