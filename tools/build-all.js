var fs = require('fs');
var path = require('path');
var packagePath = path.resolve(__dirname, '../packages');
var exec = require('child_process').execSync;
var collectPackages = require('./collect-packages');
var packages = collectPackages(packagePath).map(p => p.replace('packages/', ''));

packages.forEach((package) => {
    console.log(`building ${package}...`);

    try {
        var options = {
            stdio: 'inherit',
            cwd: path.join(packagePath, package)
        };
        var copyResults = exec(`node ../../tools/copy-project-files.js`, options);
        var buildResults = exec(`node ../../node_modules/typescript/lib/tsc.js`, options);
    } catch (err) {
        console.error(`Errors in compile`);
        console.error(err.message);
    }
    
    if (copyResults) {
        console.log(copyResults.toString());
    }
    if (buildResults) {
        console.log(buildResults.toString());
    }
});

