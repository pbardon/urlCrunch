var server = require('../src/server');

exports.testOnGet = function(test) {
    var deferred = server.onGet();
    test.ok(typeof deferred.then != 'undefined', 'Promise returned from onGet');
    test.done();
};


exports.testOnPost = function(test) {
    var deferred = server.onPost();
    test.ok(typeof deferred.then != 'undefined', 'Promise returned from onPost');
    test.done();
};

exports.testOnDelete = function(test) {
    var deferred = server.onDelete();
    test.ok(typeof deferred.then != 'undefined', 'Promise returned from onDelete');
    test.done();
};
