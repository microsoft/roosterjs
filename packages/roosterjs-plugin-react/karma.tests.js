var context = require.context('.', true, /test\/.+\.tsx?$/);

context.keys().forEach(function(key) {
    context(key);
});

module.exports = context;
