module.exports = function (context) {
    if (!!__karma__.config.components) {
        const filenameWithoutTest = __karma__.config.components.replace('Test', '');
        const filterRegExpByFilename = new RegExp(filenameWithoutTest);
        const specificFiles = context.keys().filter(path => filterRegExpByFilename.test(path));
        return specificFiles.map(context);
    } else {
        return context.keys().map(key => context(key));
    }
};
