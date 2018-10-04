var fs = require('fs');
var path = require('path');

var filename = path.resolve(__dirname, '..', 'dist/roosterjs/dist/rooster-min.js');
var file = fs.readFileSync(filename).toString();
var reg = /[a-zA-Z0-9_]+/g;
var match;
var map = {};
while (match = reg.exec(file)) {
    if (!map[match]) {
        map[match] = 1;
    } else {
        map[match]++;
    }
}
var array = Object.keys(map).map(function(key) {
    return {
        key,
        len: key.length * map[key],
    }
});

array.sort(function (a, b) {
    return b.len - a.len;
});

var result = '';
for (var a of array) {
    result += a.key + ',' + a.len + '\r\n';
}

console.log(result);
