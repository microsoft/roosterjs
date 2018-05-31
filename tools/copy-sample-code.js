const mkdirp = require('mkdirp');
const fs = require('fs');
const path = require('path');
const copy = require('./copy');
const glob = require('glob');
const ncp = require('ncp');

var root = path.resolve(__dirname, '..');
var target = path.resolve(root, 'dist/roosterjs/samplecode');
var source = path.resolve(root, 'publish/samplecode');

ncp.ncp(source, target, err => {});
