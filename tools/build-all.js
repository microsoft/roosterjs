var path = require('path');
var packagePath = path.resolve(__dirname, '../packages');
var exec = require('child_process').execSync;
var collectPackages = require('./collect-packages');
var fs = require('fs');
var packages = collectPackages(packagePath).map(p => p.replace('packages/', ''));
var isProduction = checkParam('-p', '-prod');

var typescriptPath = `node ../../node_modules/typescript/lib/tsc.js`;
function buildPackages(module) {
    packages.forEach(package => {
        console.log(`building ${package}...`);

        var options = {
            stdio: 'inherit',
            cwd: path.join(packagePath, package),
        };
        exec(`node ../../tools/copy-project-files.js`, options);

        exec(typescriptPath + ` -t es5 --moduleResolution node -m ${module}`, options);
    });
}

if (isProduction) {
    console.log('AMD:');
    buildPackages('amd');
    console.log('');

    packages.forEach(package => {
        var outDirBase = path.resolve(packagePath, '..', 'dist', package);
        fs.renameSync(`${outDirBase}/lib`, `${outDirBase}/lib-amd`);
    });
}

// important: build lib + commonjs last since the default folder is lib
console.log('CommonJS:');
buildPackages('commonjs');

function checkParam() {
    var params = process.argv;
    for (var i = 0; i < arguments.length; i++) {
        if (params.indexOf(arguments[i]) >= 0) {
            return true;
        }
    }
    return false;
}
