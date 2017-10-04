var fs = require('fs');
var path = require('path');
var glob = require('glob');
var copy = require('./copy');

var outputPath = path.resolve(__dirname, '../dist');
var cwd = process.cwd();
var packageName = path.basename(cwd);

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
}

if (!fs.existsSync(path.join(outputPath, packageName))) {
    fs.mkdirSync(path.join(outputPath, packageName));
}

let copyFn = (f) => {
    var outfile = path.join(outputPath, packageName, f);
    copy(path.join(cwd, f), outfile);
};

glob.sync('@(README|readme)*.*').forEach(copyFn);
glob.sync('@(license|LICENSE)*').forEach(copyFn);
