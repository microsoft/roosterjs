// Pack roosterjs into a standalone javascript file
// Arguments:
// -p, -prod: Pack into production mode (compressed)
// -amd:      Use amd mode rather than commonjs
// -e, -enum: Preserve const enum objects, don't convert into inlined number
var exec = require('child_process').execSync;
var path = require('path');
var rootPath = path.resolve(__dirname, '..');
var sourcePath = path.resolve(rootPath, 'packages');
var distPath = path.resolve(rootPath, 'dist/roosterjs/dist');
var webpack = require('webpack');
var isProduction = checkParam('-p', '-prod');
var isAmd = checkParam('-amd');
var preserveEnum = checkParam('-e', '-enum');
var filename = isAmd ? 'rooster-amd' : 'rooster';
var fs = require('fs');

if (isProduction) {
    filename += '-min';
}
filename += '.js';
var output = {
    filename: filename,
    path: distPath
};
if (isAmd) {
    output.libraryTarget = 'amd';
} else {
    output.library = 'roosterjs';
};

var webpackConfig = {
    entry: path.resolve(sourcePath, 'roosterjs/lib/index.ts'),
    devtool: 'source-map',
    output: output,
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
    mode: isProduction ? 'production' : 'development',
    optimization: {
        minimize: isProduction
    }
};

var version = JSON.stringify(require(path.join(__dirname, '..', 'package.json')).version).replace(/"/g, '');
var license = fs.readFileSync(path.join(__dirname, '..', 'LICENSE')).toString();
var targetFile = path.resolve(distPath, filename);

console.log('Packing file: ' + targetFile);
webpack(webpackConfig).run((err, stat) => {
    if (err) {
        console.error(err);
    } else {
        var fileContent = fs.readFileSync(targetFile).toString();
        fs.writeFileSync(targetFile, `/*\r\n    VERSION: ${version}\r\n\r\n${license}\r\n*/\r\n${fileContent}`);
    }
});

function checkParam() {
    var params = process.argv;
    for (var i = 0; i < arguments.length; i++) {
        if (params.indexOf(arguments[i]) >= 0) {
            return true;
        }
    }
    return false;
}