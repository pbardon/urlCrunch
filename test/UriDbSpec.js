var UrlDb = require('../src/UrlDb');
var testKey = 'testKey';
var testUrl = 'www.google.com';
var testKey2 = 'testKey2';
var testUrl2 = 'www.facebook.com';
var testKey3 = 'testKey3';
var testUrl3 = 'www.yahoo.com';
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

    testDisconnect: function(test) {
        test.done();
    },

    testLoadUrlCollection: function(test) {
        console.log('starting load url collection test');

        urlDb.loadUrlCollection().then(function(collection){
            test.ok(collection.s.name === 'urls', 'url collection loaded');
            test.ok(typeof collection.find !== undefined, 'collection find is defined');
            test.ok(typeof collection.insert !== undefined, 'collection  insert is defined');
            test.ok(typeof collection.remove !== undefined, 'collection remove is defined');
            test.done();
        });
    },

    // testInsertUrlObject: function(test) {
    //     console.log('starting insert url test');
    //     urlDb.insertUrlObject(testKey3, testUrl3).then(function(){
    //         console.log('url object inserted');
    //         urlDb.findById(testKey3).then(function(data){
    //             console.log('############');
    //             console.log(data);
    //             test.ok(data._id === testKey3, 'key found');
    //             test.ok(data.url === testUrl3, 'with correct value');
    //             urlDb.disconnect();
    //
    //             test.done();
    //         });
    //     });
    // },
    //
    // testFindById: function(test) {
    //     console.log('starting find by id test');
    //     urlDb.findById(testKey3).then(function(data){
    //         console.log(data);
    //         test.ok(data._id === testKey3, 'key found');
    //         test.ok(data.url === testUrl3, 'with correct value');
    //         urlDb.disconnect();
    //
    //         test.done();
    //     });
    // },
    //
    // testRemoveUrl: function(test) {
    //     console.log('starting remove url test');
    //     urlDb.removeUrl(testKey3).then(function(){
    //         console.log('removed url');
    //         urlDb.findById(testKey3).then(function(data){
    //             test.ok(!data, 'key removed');
    //             urlDb.disconnect();
    //
    //             test.done();
    //         });
    //     });
    // },
    //
    // testRemoveUrlCollection: function(test) {
    //     console.log('starting remove url collection test');
    //     urlDb.loadUrlCollection().then(function(){
    //         console.log('loaded url collection');
    //         urlDb.removeUrlCollection().then(function(data) {
    //             test.ok(data, 'url collection removed');
    //             urlDb.disconnect();
    //
    //             test.done();
    //         });
    //     });
    // }
};
