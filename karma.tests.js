require('core-js/es5');
require('core-js/modules/es6.promise');

var context = require.context('./dist', true, /test\/.+\.js?$/);

context.keys().forEach(
    function(key) {
        context(key);
    });
    
module.exports = context;