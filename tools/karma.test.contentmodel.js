var context = require.context(
    '../packages',
    true,
    /roosterjs-content-model(-\w+)?\/test\/.+\.ts?$/
);
var karmaTest = require('./karma.test');

module.exports = karmaTest(context);
