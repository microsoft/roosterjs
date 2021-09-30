var context = require.context('./packages', true, /test\/.+\.ts?$/);

if (!!__karma__.config.components) {
    const filenameWithoutTest = __karma__.config.components.replace('Test', '');
    const filterRegExpByFilename = new RegExp(filenameWithoutTest);
    const specificFiles = context.keys().filter(path => filterRegExpByFilename.test(path));
    module.exports = specificFiles.map(context);
} else {
    module.exports = context.keys().map(key => context(key));
}
