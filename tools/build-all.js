var fs = require('fs');
var path = require('path');
var packagePath = path.resolve(__dirname, '../packages');
var exec = require('child_process').execSync;
var collectPackages = require('./collect-packages');
var packages = collectPackages(packagePath).map(p => p.replace('packages/', ''));

packages.forEach((package) => {
    console.log(`building ${package}...`);

    try {
        var results = exec(`npm run build`, { stdio: 'inherit', cwd: path.join(packagePath, package) });
    } catch (err) {
        console.error(`Errors in compile`);
        console.error(err.message);
    }
    
    if (results) {
        console.log(results.toString());
    }
});

