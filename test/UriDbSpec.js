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
        // urlDb.disconnect();
        // console.log('disconnected from db');
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
        console.log('starting add url test');

        var key = urlDb.addUrl(testKey, testUrl).then(function(data){
            console.log(data);
            test.ok(data, 'able to add url to db');
            test.done();
        });
    },

    testLoadUrlCollection: function(test) {
        console.log('starting load url collection test');

        urlDb.loadUrlCollection().then(function(data){
            test.ok(data.s.name === 'urls', 'url collection loaded');
            test.done();
        });
    },

    testRemoveUrlCollection: function(test) {
        console.log('starting remove url collection test');
        urlDb.loadUrlCollection().then(function(){
            urlDb.removeUrlCollection().then(function(data) {
                test.ok(data, 'url collection removed');
                test.done();
            });
        });
    },

    testFindById: function(test) {
        console.log('starting find by id test');

        test.done();

    }
};

// exports.testGetUri = function(test) {
//     var uri = db.getUri(testKey);
//     test.ok(uri === testUri, 'able to retrive uri from map');
//     test.done();
// };
//
// exports.testRemoveUri = function(test) {
// };
