const mkdirp = require('mkdirp');
const fs = require('fs');
const path = require('path');
const copy = require('./copy');
const glob = require('glob');
const ncp = require('ncp');

var root = path.resolve(__dirname, '..');
var target = path.resolve(root, 'publish/samplecode/common');
var source = path.resolve(root, 'dist/roosterjs/dist');
if (!fs.existsSync(target)) {
    mkdirp.sync(target);
}

let copyFn = (f) => {
    var outfile = path.join(target, f);
    copy(path.join(source, f), outfile);
};

['rooster.js', 'rooster-amd.js', 'rooster.d.ts', 'rooster-amd.d.ts'].forEach(copyFn);

target = path.resolve(root, 'dist/roosterjs/samplecode');
source = path.resolve(root, 'publish/samplecode');

ncp.ncp(source, target, err => {});
