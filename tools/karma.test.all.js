var context = require.context('../packages', true, /test\/.+\.ts?$/);
var karmaTest = require('./karma.test');

module.exports = karmaTest(context);
