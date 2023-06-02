var context = require.context('../packages/roosterjs-content-model', true, /test\/.+\.ts?$/);
var karmaTest = require('./karma.test');

module.exports = karmaTest(context);
