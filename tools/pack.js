var path = require('path');
var rootPath = path.resolve(__dirname, '..');
var sourcePath = path.resolve(rootPath, 'packages');
var distPath = path.resolve(rootPath, 'dist');
var webpack = require('webpack');
var param = process.argv[2];
var isProduction = param == '-p';
var webpackConfig = {
    entry: path.resolve(sourcePath, 'roosterjs/lib/index.ts'),
    output: {
        library: 'roosterjs',
        filename: 'rooster.js',
        path: distPath
    },
    resolve: {
        extensions: ['.ts'],
        modules: [ sourcePath ],
    },
    module: {
        rules: [{
            test: /\.ts$/,
            loader: 'ts-loader',
            options: {
                compilerOptions: {
                    declaration: false,
                    preserveConstEnums: false
                },
            }
        }]
    },
    stats: 'minimal',
    plugins: isProduction ? [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                dead_code: true,
                warnings: true,
                screw_ie8: true,
                drop_debugger: true,
                drop_console: true,
                unsafe: false,
            },
        })
    ] : []
};

console.log('Packing file: ' + path.resolve(distPath, 'rooster.js'));
webpack(webpackConfig).run((err, stat) => {
    if (err) {
        console.error(err);
    }
});
