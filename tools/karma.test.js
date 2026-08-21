module.exports = function (contexts) {
    const components = __karma__.config.components;
    const testPathPattern = __karma__.config.testPathPattern;

    if (!!components || !!testPathPattern) {
        const pattern = testPathPattern || components.replace('Test', '');
        const filterRegExpByFilename = new RegExp(pattern);
        const specificFiles = [];

        contexts.forEach(context => {
            specificFiles.push(...context.keys().filter(path => filterRegExpByFilename.test(path)));
        });

        console.log(
            '\n\nRunning test cases from ' +
                specificFiles.length +
                ' files matching pattern: ' +
                pattern
        );

        return specificFiles.map(file => contexts[0](file));
    } else {
        const specificFiles = [];

        contexts.forEach(context => {
            specificFiles.push(...context.keys().map(key => context(key)));
        });

        console.log('\n\nRunning test cases from ' + specificFiles.length + ' files...');

        return specificFiles;
    }
};
