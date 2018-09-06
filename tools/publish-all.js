var fs = require('fs');
var path = require('path');
var packagePath = path.resolve(__dirname, '../packages');
var distPath = path.resolve(__dirname, '../dist');
var exec = require('child_process').execSync;
var collectPackages = require('./collect-packages');
var packages = collectPackages(packagePath).map(p => p.replace('packages/', ''));

function readPackageJson(package) {
    var packageJsonFilePath = path.join(packagePath, package, 'package.json');
    var content = fs.readFileSync(packageJsonFilePath);
    var packageJson = JSON.parse(content);
    return packageJson;
}

packages.forEach((package) => {
    var json = readPackageJson(package);

    if (json.version) {
        console.log(`skipping ${package}...`);
    } else {
        console.log(`building ${package}...`);

        var options = {
            stdio: 'inherit',
            cwd: path.join(distPath, package)
        };
        exec(`npm publish`, options);
    }
});

