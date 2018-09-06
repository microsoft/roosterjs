var fs = require('fs');
var path = require('path');
var packagePath = path.resolve(__dirname, '../packages');
var collectPackages = require('./collect-packages');

var mainPackageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json')));

var packages = collectPackages(packagePath).map(p => p.replace('packages/', ''));

var knownCustomizedPackages = {};

packages.forEach((package) => {
    console.log(`normalizing ${package}...`);
    normalizePackageJson(package, packages);
});

function readPackageJson(package) {
    var packageJsonFilePath = path.join(packagePath, package, 'package.json');
    var content = fs.readFileSync(packageJsonFilePath);
    var packageJson = JSON.parse(content);
    return packageJson;
}

function normalizePackageJson(package, packages) {
    var packageJson = readPackageJson(package);

    Object.keys(packageJson.dependencies).forEach((dep) => {
        if (knownCustomizedPackages[dep]) {
            packageJson.dependencies[dep] = knownCustomizedPackages[dep];
        } else if (packages.indexOf(dep) > -1) {
            packageJson.dependencies[dep] = mainPackageJson.version;
        } else if (
            mainPackageJson.dependencies && mainPackageJson.dependencies[dep]) {
            packageJson.dependencies[dep] = mainPackageJson.dependencies[dep];
        } else if (!packageJson.dependencies[dep]) {
            console.error("there is a missing dependency in the main package.json: ", dep);
        }
    });

    if (packageJson.version) {
        knownCustomizedPackages[packageJson.name] = packageJson.version;
    } else {
        packageJson.version = mainPackageJson.version;
    }

    packageJson.typings = "./lib/index.d.ts";
    packageJson.main = "./lib/index.js";
    packageJson.license = "MIT";
    packageJson.repository = {
        "type": "git",
        "url": "https://github.com/Microsoft/roosterjs"
    };

    var distPath = path.join(__dirname, '../dist/');
    var targetPackagePath = path.join(distPath, packageJson.name);
    var targetFileName = path.join(targetPackagePath, 'package.json');
    fs.existsSync(distPath) || fs.mkdirSync(distPath);
    fs.existsSync(targetPackagePath) || fs.mkdirSync(targetPackagePath);
    fs.writeFileSync(targetFileName, JSON.stringify(packageJson, null, 4));
}
