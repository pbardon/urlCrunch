var server = require('../src/server');
var testDb = 'mongodb://localhost:27017/test';
var UrlDb = require('../src/UrlDb');
var urlDb = new UrlDb(testDb);

exports.testOnPost = function(test) {
    var deferred = server.onPost(urlDb, 'www.ebay.com');
    test.ok(typeof deferred.then != 'undefined', 'Promise returned from onPost');
    test.done();
};

exports.testOnGet = function(test) {
    var deferred = server.onGet(urlDb, '/link/AFDS3');
    test.ok(typeof deferred.then != 'undefined', 'Promise returned from onGet');
    test.done();
};


exports.testOnDelete = function(test) {
    var deferred = server.onDelete(urlDb,'/link/AFDS3');
    test.ok(typeof deferred.then != 'undefined', 'Promise returned from onDelete');
    test.done();
};
