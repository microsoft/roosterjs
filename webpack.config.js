var CaseSensitivityPlugin = require('case-sensitive-paths-webpack-plugin');
var path = require('path');

module.exports = {
    entry: './sample/scripts/sample.ts',
    output: {
        filename: 'sample.js',
        path: __dirname + '/sample/scripts',
        publicPath: '/sample/scripts/',
        sourceMapFilename: '[name].map'
    },
    plugins: [
        new CaseSensitivityPlugin()
    ],    
    resolve: {
        extensions: ['', '.ts', '.js'],
        root: [
            path.resolve('./dist')
        ]
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ],
        preLoaders: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { test: /\.js$/, loader: "source-map-loader" }
        ]        
    },
    watch: true,
    stats: "minimal",
    devServer: {
        host: "0.0.0.0", // This makes the server public so that others can test by http://hostname ...
        port: 3000
    }
}