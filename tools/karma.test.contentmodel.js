var contextContentModel = require.context('../packages-content-model', true, /test\/.+\.ts?$/);

var karmaTest = require('./karma.test');

module.exports = karmaTest([contextContentModel]);
