module.exports = {
    entry: './source.js',
    output: {
        filename: 'start.js',
        path: __dirname,
        publicPath: '.',
    },
    resolve: {
        extensions: ['.js'],
        modules: ['./'],
    },
};
