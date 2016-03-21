var server = require('../src/server');
var testDb = 'mongodb://localhost:27017/test';
var testUri = '/link/AFDS3';
var testUrl = 'www.ebay.com';
var linkBase = '/link/',
returnedId;

var UrlDb = require('../src/UrlDb');
var urlDb = new UrlDb(testDb);

var mockResponse = {
    writeHead: function(){
        console.log(arguments);
    }
};


exports.testOnPost = function(test) {
    urlDb.initialize().then(function(data){
        console.log('initialized db, now starting on post test');
        var deferred = server.onPost(urlDb, null, {url: testUrl}, mockResponse).then(function(data){
            console.log(data);
            test.ok(data[1]._id, 'saved with id');
            test.ok(data[1].url === testUrl, 'saved with id');
            returnedId = data._id;
            urlDb.disconnect();
            test.done();
        });
        test.ok(typeof deferred.then != 'undefined', 'Promise returned from onPost');
    });
};

exports.testOnGet = function(test) {
    var uri = linkBase + returnedId;
    urlDb.initialize().then(function(data){
        var deferred = server.onGet(urlDb, uri, {}, mockResponse).then(function(data){
            console.log(data);
            test.ok(data[1]._id === returnedId, 'correct id retrieved');
            test.ok(data[1].url === testUrl, 'correct value retrieved');
            urlDb.disconnect();
            test.done();
        });
        test.ok(typeof deferred.then != 'undefined', 'Promise returned from onGet');
    });
};


exports.testOnDelete = function(test) {
    var uri = linkBase + returnedId;
    urlDb.initialize().then(function(data){
        var deferred = server.onDelete(urlDb,uri).then(function(data){
            test.ok(data === returnedId, 'correct id deleted');
            urlDb.disconnect();
            test.done();
        });
        test.ok(typeof deferred.then != 'undefined', 'Promise returned from onDelete');
    });
};
