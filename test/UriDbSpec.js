var UrlDb = require('../src/UrlDb');
var testKey = 'testKey';
var testUrl = 'www.google.com';
var testDb = 'mongodb://localhost:27017/test';
var database;
var urlDb = new UrlDb(testDb);


module.exports = {
    setUp: function(callback){
        urlDb.connect().then(function(data){
            console.log('connected to db');
            urlDb.db = data;
            callback();
        });
    },

    tearDown: function(callback){
        urlDb.disconnect();
        console.log('disconnected from db');
        callback();
    },

    testConnect: function(test) {
        console.log('starting connect test');
        var uri = urlDb.connect().then(function(db){
            console.log('connected to db');
            test.ok(typeof db.find !== undefined, 'able to connect to db');
            test.done();
        });
    },

    testAddUrl: function(test) {
        var key = urlDb.addUrl(testKey, testUrl).then(function(data){
            console.log(data);

            test.ok(data, 'able to add url to db');
            test.done();
        });
    },
};

// exports.testGetUri = function(test) {
//     var uri = db.getUri(testKey);
//     test.ok(uri === testUri, 'able to retrive uri from map');
//     test.done();
// };
//
// exports.testRemoveUri = function(test) {
// };
