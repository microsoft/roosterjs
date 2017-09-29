module.exports = {
    entry: './sample/scripts/sample.ts',
    output: {
        filename: 'sample.js',
        path: __dirname + '/sample/scripts',
        publicPath: '/sample/scripts/',
        sourceMapFilename: '[name].map'
    },
    resolve: {
        extensions: ['.ts', '.js'],
        modules: [
            './dist',
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
        port: 3000
    }
}