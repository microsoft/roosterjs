var fs = require('fs');
var path = require('path');
var packagePath = path.resolve(__dirname, '../packages');
var exec = require('child_process').execSync;
var collectPackages = require('./collect-packages');
var packages = collectPackages(packagePath).map(p => p.replace('packages/', ''));

packages.forEach((package) => {
    console.log(`building ${package}...`);

    var options = {
        stdio: 'inherit',
        cwd: path.join(packagePath, package)
    };
    exec(`node ../../tools/copy-project-files.js`, options);
    exec(`node ../../node_modules/typescript/lib/tsc.js`, options);
});

