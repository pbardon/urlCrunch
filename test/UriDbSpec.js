var UriDb = require('../src/UriDb');
var fs = require('fs');
var path = process.cwd().slice(0,-5) + '/uriDb';
var testKey = 'testKey';
var testUri = 'www.google.com';
var db = new UriDb(path);
var testFilePath = path + '/' + testKey;


exports.testSaveUriToDisk = function(test) {
    db.saveUriObject(testKey, testUri).then(function(key, uri) {
        fs.readFile(testFilePath, function(err, data) {
            if (err) {
                return console.log(err);
            }
            test.ok(data == testUri, 'saved test uri to disk');
            test.done();
        });
    }, function(err) {
        console.log(err);
    });
};

exports.testLoadUris = function(test){
    db.loadUris().then(function() {
        test.ok(typeof db.uriMap[testKey] !== 'undefined', 'successfully loaded uri');
        test.ok(db.uriMap[testKey] === 'www.google.com');

        console.log(testFilePath);
        test.done();
    });
};

exports.testGetUri = function(test) {
    var uri = db.getUri(testKey);
    test.ok(uri === testUri, 'able to retrive uri from map');
    test.done();
};

exports.testRemoveUri = function(test) {
    test.expect(1);
    db.removeUri(testKey).then(function() {
        fs.readFile(testFilePath, function(err, data) {
            if (err) {
                test.ok(err.message.slice(0,6) === 'ENOENT', 'confirm that file is removed.');
                test.done();
            }
        });
    });
};
