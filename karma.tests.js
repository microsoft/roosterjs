var context = require.context('./packages', true, /test\/.+\.ts?$/);

context.keys().forEach(
    function(key) {
        context(key);
    });

module.exports = context;