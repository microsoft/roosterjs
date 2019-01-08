module.exports = {
    entry: './source.ts',
    output: {
        filename: 'start.js',
        path: __dirname,
        publicPath: '.',
    },
    resolve: {
        extensions: ['.ts', '.js'],
        modules: ['.', './node_modules'],
    },
    module: {
        loaders: [{ test: /\.ts$/, loader: 'ts-loader' }],
    },
};
