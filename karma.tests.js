var context = require.context('./dist', true, /test\/.+\.js?$/);

context.keys().forEach(
    function(key) {
        context(key);
    });
    
module.exports = context;