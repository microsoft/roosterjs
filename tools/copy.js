const mkdirp = require('mkdirp');
const fs = require('fs');
const path = require('path');  

module.exports = function copy(src, dst) {
    mkdirp.sync(path.dirname(dst));
    fs.writeFileSync(dst, fs.readFileSync(src));    
}