const devServerPort = 3000;

module.exports = {
    entry: './publish/samplesite/scripts/index.ts',
    devtool: 'source-map',
    output: {
        filename: 'demo.js',
        path: __dirname + '/scripts',
        publicPath: '/scripts/',
        sourceMapFilename: '[name].map',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.svg', '.scss', '.'],
        modules: ['./publish/samplesite/scripts', 'packages', './node_modules'],
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
            },
            {
                test: /\.svg$/,
                loader: 'url-loader',
                options: {
                    mimetype: 'image/svg+xml',
                },
            },
            {
                test: /\.scss$/,
                use: [
                    '@microsoft/loader-load-themed-styles',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                        },
                    },
                    'sass-loader',
                ],
            },
        ],
    },
    watch: true,
    stats: 'minimal',
    devServer: {
        host: '0.0.0.0', // This makes the server public so that others can test by http://hostname ...
        port: devServerPort,
        open: true,
        openPage: '',
        public: 'localhost:' + devServerPort,
    },
};
