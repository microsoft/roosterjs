var contextRoosterjs = require.context('../packages', true, /test\/.+\.ts?$/);
var contextUI = require.context('../packages-ui', true, /test\/.+\.ts?$/);
var contextContentModel = require.context('../packages-content-model', true, /test\/.+\.ts?$/);
var karmaTest = require('./karma.test');

module.exports = karmaTest([contextRoosterjs, contextUI, contextContentModel]);
