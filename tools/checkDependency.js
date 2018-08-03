var fs = require('fs');
var path = require('path');
var packagePath = path.resolve(__dirname, '../packages');
var collectPackages = require('./collect-packages');
var packages = collectPackages(packagePath).map(p => p.replace('packages/', ''));

packages.forEach((package) => {
    console.log(`Checking dependency for  ${package}...`);
    processFile(path.join(packagePath, package, 'lib/index'), []);
});

function processFile(filename, files) {
    if (!/\.ts.?$/.test(filename)) {
        filename += '.ts';
    }
    var index = files.indexOf(filename);
    if (index >= 0) {
        files = files.slice(index);
        files.push(filename);
        throw new Error(`Circular dependency: \r\n${files.join(' =>\r\n')}`);
    }

    files.push(filename);
    var dir = path.dirname(filename);
    var content = fs.readFileSync(filename).toString();
    var reg = /from\s+'([^']+)'/g;
    var match;
    while (match = reg.exec(content)) {
        var nextfile = match[1];
        if (nextfile && nextfile[0] == '.') {
            processFile(path.resolve(dir, nextfile), files.slice());
        }
    }
}