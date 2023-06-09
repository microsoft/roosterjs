const path = require('path');
const devServerPort = 3000;

const externalMap = new Map([
    ['react', 'React'],
    ['react-dom', 'ReactDOM'],
    [/^office-ui-fabric-react(\/.*)?$/, 'FluentUIReact'],
    [/^@fluentui(\/.*)?$/, 'FluentUIReact'],
]);

module.exports = {
    entry: path.join(__dirname, './demo/scripts/index.ts'),
    devtool: 'source-map',
    output: {
        filename: 'demo.js',
        path: __dirname + '/scripts',
        publicPath: '/scripts/',
        sourceMapFilename: '[name].map',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.svg', '.scss', '.'],
        modules: ['./demo/scripts', 'packages', 'packages-ui', './node_modules'],
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    compilerOptions: {
                        downlevelIteration: true,
                        importHelpers: true,
                    },
                },
            },
            {
                test: /\.svg$/,
                loader: 'url-loader',
                options: {
                    mimetype: 'image/svg+xml',
                    esModule: false,
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
    externals: function (context, request, callback) {
        for (const [key, value] of externalMap) {
            if (key instanceof RegExp && key.test(request)) {
                return callback(null, request.replace(key, value));
            } else if (request === key) {
                return callback(null, value);
            }
        }

        callback();
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
