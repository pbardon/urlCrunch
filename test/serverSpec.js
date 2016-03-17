var server = require('../src/server');

var databaseMock = {
    uriMap : {
        AFDS3: 'hello'
    }
};

exports.testOnGet = function(test) {
    var deferred = server.onGet(databaseMock, '/link/AFDS3');
    test.ok(typeof deferred.then != 'undefined', 'Promise returned from onGet');
    test.done();
};


exports.testOnPost = function(test) {
    var deferred = server.onPost(databaseMock, '/link/AFDS3');
    test.ok(typeof deferred.then != 'undefined', 'Promise returned from onPost');
    test.done();
};

exports.testOnDelete = function(test) {
    var deferred = server.onDelete(databaseMock,'/link/AFDS3');
    test.ok(typeof deferred.then != 'undefined', 'Promise returned from onDelete');
    test.done();
};
