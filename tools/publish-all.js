var path = require('path');
var packagePath = path.resolve(__dirname, '../packages');
var distPath = path.resolve(__dirname, '../dist');
var exec = require('child_process').execSync;
var collectPackages = require('./collect-packages');
var packages = collectPackages(packagePath).map(p => p.replace('packages/', ''));

packages.forEach((package) => {
    console.log(`building ${package}...`);

    var options = {
        stdio: 'inherit',
        cwd: path.join(distPath, package)
    };
    exec(`npm publish`, options);
});

