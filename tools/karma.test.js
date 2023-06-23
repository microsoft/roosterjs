module.exports = function (contexts) {
    if (!!__karma__.config.components) {
        const filenameWithoutTest = __karma__.config.components.replace('Test', '');
        const filterRegExpByFilename = new RegExp(filenameWithoutTest);
        const specificFiles = [];

        contexts.forEach(context => {
            specificFiles.push(...context.keys().filter(path => filterRegExpByFilename.test(path)));
        });

        return specificFiles.map(context);
    } else {
        const specificFiles = [];

        contexts.forEach(context => {
            specificFiles.push(...context.keys().map(key => context(key)));
        });

        console.log('\n\nRunning test cases from ' + specificFiles.length + ' files...');

        return specificFiles;
    }
};
