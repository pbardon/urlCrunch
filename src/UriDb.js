var fs = require('fs'),
pg = require('pg'),
path = require('path');
q = require('q');


function UriDb(path) {
    this.uriMap = {};
    this.dbPath = path;
    return this;
}

UriDb.prototype.getUri = function(key) {
    if(this.uriMap[key]) {
        return this.uriMap[key];
    }else {
        return false;
    }
};

UriDb.prototype.addUri = function(key, uri) {
    //Check for key collision
    if (!this.uriMap[key]) {
    //Add uri to map
        saveUriObject(key, uri)
        .then(function() {
            this.uriMap[key] = uri;
            return key;
        },function(err) {

        });
    }else {
    //Key collision, generate a new key
        key = 'newKey';
        this.addUri(key, uri);
    }
};

UriDb.prototype.saveUriObject = function(key, uri) {
    var deferred = q.defer();
    console.log('starting to save uri object');
    writeUriObjectToDisk(this.dbPath, key, uri)
    .then(function(key, uri){
        deferred.resolve(key, uri);
    },function(err) {
        deferred.reject(err);
    });
    return deferred.promise;
};

UriDb.prototype.loadUris = function() {
    var deferred = q.defer();
    var dbLoadPromises = [];
    var oThis = this;
    path = this.dbPath;
    // Read each of the JSON files on disk using key-value pairs to build uri map
    fs.readdir(path, function(err, keys){
        keys.forEach(function(key){
            dbLoadPromises.push(readUriFromDisk(path + '/' + key)
            .then(function(data) {
                oThis.uriMap[key] = data;
            }));
        });

        q.all(dbLoadPromises).then(function(){
            deferred.resolve();
        }, function(err) {
            console.log(err);
            deferred.reject(err);
        });

    },function(err) {
        deferred.reject(err);
    });
    return deferred.promise;
};

UriDb.prototype.removeUri = function(key) {
    var deferred = q.defer();
    console.log('attempting to remove uri');
    console.log(key);


    if (this.uriMap[key]) {
        console.log('found key in map');
        fs.unlink(this.dbPath + '/' + key, function(err) {
            if (err) {
                console.log(err);
                throw err;
            }
            console.log('removed uri entry at key: ');
            console.log(key);
            deferred.resolve();
        });
    } else {
        console.log('could not find key' + key + ' .');
        deferred.reject(new Error('Uri object does not exist in map'));
    }

    return deferred.promise;

};

function readUriFromDisk(path) {
    var deferred = q.defer();
    console.log(path);
    fs.readFile(path, function(err, data) {
        data = data.toString();
        console.log(data);
        deferred.resolve(data);
    });
    return deferred.promise;
}

function writeUriObjectToDisk(path, key, uri) {
    var deferred = q.defer();
    fs.writeFile(path + '/' + key, uri, function(err, data) {
        if (err) {
            console.log(err);
            return deferred.reject(err);
        }
        console.log('saved uri: ' + uri +  ' to disk, with key:  ' + key );
        deferred.resolve(key, uri);
    });

    return deferred.promise;
}

module.exports = UriDb;
