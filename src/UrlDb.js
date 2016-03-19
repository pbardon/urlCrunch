var fs = require('fs'),
pg = require('pg'),
path = require('path'),
q = require('q'),
key = require('./key'),
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
        db.collections(function(err, data){
            if(data.indexOf('urls') === -1 ){
                db.createCollection("urls", function(err, collection){
                    if(err){
                        log(err);
                        deferred.reject(err);
                    }

                    console.log('created urls collection ');

                    this.db = db;
                    deferred.resolve(db);
                });
            }
        });
    });

    return deferred.promise;
};

UrlDb.prototype.disconnect = function(){
    if (!this.db){
        throw new Error('db is not connected');
    }

    this.db.close();
};

UrlDb.prototype.getUrl = function(dbKey) {
    var searchUrl = this.db.urls.find({ _id: dbKey });
    if(searchUrl) {
        return searchUrl.url;
    }else {
        return false;
    }
};

UrlDb.prototype.addUrl = function(dbKey, url) {
    var deferred = q.defer(),
    oThis = this;
    //Check for key collision
    log('about to add url');
    this.findById(dbKey).then(function(urlObject){
        console.log('finished searching, found:');
        console.log(urlObject);
        if (!urlObject) {
            console.log('adding url object');
            return oThis.insertUrlObject(dbKey, url).then(function(obj){
                deferred.resolve(obj);

            }, function(err){
                deferred.reject(err);
            });
        }

        dbKey = key.generateKey(url, dbKey.length + 1);
        console.log('found object for key, genreated new key: ' + dbKey);
        oThis.addUrl(dbKey, url).then(function(data){
            deferred.resolve(data);

        });
    });

    return deferred.promise;
};

UrlDb.prototype.findById = function(dbKey) {
    var deferred = q.defer();
    this.db.open(function(err, db){
        if(err){
            log(err);
            deferred.reject(err);
        }
        db.collection("urls", function(err, collection){
            if(err){
                log(err);
                deferred.reject(err);
                return;
            }
            console.log('searching for url with key: ' + dbKey);

            var searchUrl = collection.find({ _id: dbKey}).toArray( function(err, data){
                if(err){
                    log(err);
                    deferred.reject(err);
                    return;
                }
                if(!data[0]){
                    log('could not find url with key: '+ dbKey);
                    deferred.resolve(false);
                    db.close();
                    return;
                }
                log('search url returned');
                log(JSON.stringify(data[0]));
                db.close();
                deferred.resolve(data[0]);
            });
        });
    });
    return deferred.promise;
};

UrlDb.prototype.insertUrlObject = function(dbKey, url){
    var deferred = q.defer();
    console.log('inserting url object');
    this.db.open(function(err, db){
        console.log('db open');
        db.collection("urls", function(err, collection){
            if(err){
                log(err);
                deferred.reject(err);
                return;
            }
            console.log('inserting url' + url +' with key: ' + dbKey);

            var searchUrl = collection.insert({ _id: dbKey, url: url}, function(err, data){
                if(err){
                    log(err);
                    deferred.reject(err);
                    return;
                }

                if (data.result.ok === 1 ) {
                    log('inserted url');
                    log(JSON.stringify(data));
                    deferred.resolve(data.insertedIds[0]);
                }

                log('could not insert url');
                deferred.resolve(false);

                db.close();
            });
        });
    });

    return deferred.promise;
};

UrlDb.prototype.removeUrl = function(dbKey) {
    console.log('attempting to remove uri:');
    console.log(dbKey);
    var searchUrl = this.db.urls.find({ _id: dbKey });
    if (searchUrl) {
        console.log('found url, removing from db');
        this.uriMap[dbKey] = undefined;
        this.db.urls.remove(dbKey);
    } else {
        console.log('could not find url with key: ' + dbKey + ' .');
    }
};

module.exports = UrlDb;
