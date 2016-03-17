var fs = require('fs'),
pg = require('pg'),
path = require('path'),
q = require('q'),
log = console.log;

var MongoClient = require('mongodb').MongoClient;


function UrlDb(dbUri) {
    this.db = {};
    this.mongoUri = dbUri;
    return this;
}

UrlDb.prototype.connect = function(){
    var deferred = q.defer();
    console.log('about to connect to mongodb');
    MongoClient.connect(this.mongoUri, function(err, db){
        if (err){
            console.log(err);
            return deferred.reject(err);
        }
        console.log('connected to mongodb');
        this.db = db;
        deferred.resolve(db);
    });

    return deferred.promise;
};

UrlDb.prototype.disconnect = function(){
    if (!this.db){
        throw new Error('db is not connected');
    }

    this.db.close();
};

UrlDb.prototype.getUrl = function(key) {
    var searchUrl = this.db.urls.find({ _id: key });
    if(searchUrl) {
        return searchUrl.url;
    }else {
        return false;
    }
};

UrlDb.prototype.addUrl = function(key, url) {
    var deferred = q.defer();
    //Check for key collision
    log('about to add url');
    // this.db.open(function(err, db) {
    //     var urlCollection = this.db.urls('urlCollection');
    //     urlCollection.insert({});
    //     log(urlCollection);
    //     db.close();
    // }
    if (!this.db.urls){
        log('creating url collection');
        var urlCollection = this.db.urls('urlCollection');
        urlCollection.insert({});
        log(urlCollection);
    }

    this.db.urls.insert({ _id: key });

    log(this.db.urls.find());


    var searchUrl = this.db.urls.find({ _id: key });
    log('search url returned');
    log(JSON.stringify(searchUrl));
    if (!searchUrl) {
    //Add url to map
        this.db.urls.insert({
            _id: key,
            url: url
        });
        return key;
    }else {
        log('generating new key');

    //Key collision, generate a new key with an extra character
        key = key.generateKey(url, keyLength + 1);
        this.addUrl(key, url);
    }

    return deferred.promise;
};

UrlDb.prototype.removeUrl = function(key) {
    console.log('attempting to remove uri:');
    console.log(key);
    var searchUrl = this.db.urls.find({ _id: key });
    if (searchUrl) {
        console.log('found url, removing from db');
        this.uriMap[key] = undefined;
        this.db.urls.remove(key);
    } else {
        console.log('could not find url with key: ' + key + ' .');
    }
};

module.exports = UrlDb;
