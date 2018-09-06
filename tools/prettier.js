var path = require('path');
var exec = require('child_process').execSync;

function run(target) {
    var options = {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
    };
    exec(`node node_modules/prettier/bin-prettier --tab-width 4 --print-width 100 --write --trailing-comma es5 --jsx-bracket-same-line --single-quote "` + target + '"', options);
}

run('packages/**/*.ts');
