// Pack roosterjs demo site into a standalone javascript file
var path = require('path');
var rootPath = path.resolve(__dirname, '..');
var sourcePath = path.resolve(rootPath, 'publish', 'samplesite', 'scripts');
var distPathRoot = path.resolve(rootPath, 'dist/roosterjs/samplesite');
var distPath = path.resolve(distPathRoot, 'scripts');
var webpack = require('webpack');
var filename = 'demo.js';
var fs = require('fs');
var typescriptPath = `node ../../../node_modules/typescript/lib/tsc.js`;
var exec = require('child_process').execSync;

var output = {
    filename,
    path: distPath,
};

var webpackConfig = {
    entry: path.resolve(sourcePath, 'index.ts'),
    devtool: 'source-map',
    output,
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.svg', '.scss', '.'],
        modules: ['./publish/samplesite/scripts', 'packages', './node_modules'],
    },
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
    stats: 'minimal',
    mode: 'development',
};

var version = JSON.stringify(require(path.join(rootPath, 'package.json')).version).replace(
    /"/g,
    ''
);
var license = fs.readFileSync(path.join(rootPath, 'LICENSE')).toString();
var targetFile = path.resolve(distPath, filename);

console.log('Packing demo site ...');

// 1. Run tsc with --noEmit to do code check
exec(typescriptPath + ' --noEmit ', {
    stdio: 'inherit',
    cwd: sourcePath,
});

// 2. Run webpack to generate target code
webpack(webpackConfig).run((err, stat) => {
    if (err) {
        console.error(err);
    } else {
        var fileContent = fs.readFileSync(targetFile).toString();
        fs.writeFileSync(
            targetFile,
            `/*\r\n    VERSION: ${version}\r\n\r\n${license}\r\n*/\r\n${fileContent}`
        );
        fs.copyFileSync(
            path.resolve(rootPath, 'index.html'),
            path.resolve(distPathRoot, 'index.html')
        );
        fs.writeFileSync(
            path.resolve(distPathRoot, 'scripts', 'version.js'),
            `window.roosterJsVer = "v${version}";`
        );
    }
});
