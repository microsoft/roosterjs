var context = require.context('../packages', true, /roosterjs(-editor-\w+)?\/test\/.+\.ts?$/);
var karmaTest = require('./karma.test');

module.exports = karmaTest(context);
