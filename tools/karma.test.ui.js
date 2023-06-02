var context = require.context('../packages-ui', true, /test\/.+\.ts?$/);
var karmaTest = require('./karma.test');

module.exports = karmaTest(context);
