var fs = require('fs'),
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
    var collectionNames;
    MongoClient.connect(this.mongoUri, function(err, db){
        if (err){
            console.log(err);
            return deferred.reject(err);
        }
        this.db = db;
        db.close();
        deferred.resolve(db);
    });

    return deferred.promise;
};


UrlDb.prototype.loadUrlCollection = function() {
    var deferred = q.defer(),
    collectionNames,
    urlCollection;
    this.db.open(function(err, db){
        db.collections(function(err, data){
            if (err) {
                log(err);
                db.close();
                deferred.reject(err);
                return;
            }
            //Check to see if the collection exists..
            collectionNames = data.forEach(function(item) {
                if (item.s.name === 'urls'){
                    urlCollection = item;
                }
                return item.s.name;
            });
            //Check to make sure it exists..
            if(!urlCollection){
                //Create the collection if it doesn't exist.
                return db.createCollection('urls', function(err, collection){
                    if(err){
                        log(err);
                        deferred.reject(err);
                        db.close();
                        return;
                    }
                    db.close();
                    deferred.resolve(collection);
                });
            }

            //Otherwise just return the collection...
            deferred.resolve(urlCollection);
            db.close();
            return;
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
    this.findById(dbKey).then(function(urlObject){
        if (!urlObject) {
            return oThis.insertUrlObject(dbKey, url).then(function(obj){
                deferred.resolve(obj);

            }, function(err){
                deferred.reject(err);
            });
        }

        dbKey = key.generateKey(url, dbKey.length + 1);
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
            db.close();
        }
        db.collection("urls", function(err, collection){
            if(err){
                log(err);
                db.close();
                deferred.reject(err);
                return;
            }

            var searchUrl = collection.find({ _id: dbKey}).toArray( function(err, data){
                if(err){
                    log(err);
                    db.close();
                    deferred.reject(err);
                    return;
                }
                if(!data[0]){
                    log('could not find url with key: '+ dbKey);
                    db.close();
                    deferred.resolve(false);
                    return;
                }
                db.close();
                deferred.resolve(data[0]);
            });
        });
    });
    return deferred.promise;
};

UrlDb.prototype.insertUrlObject = function(dbKey, url){
    var deferred = q.defer();
    this.db.open(function(err, db){
        if(err){
            log(err);
            deferred.reject(err);
            db.close();
            return;
        }
        db.collection("urls", function(err, collection){
            if(err){
                log(err);
                db.close();
                deferred.reject(err);
                return;
            }
            var searchUrl = collection.insert({ _id: dbKey, url: url}, function(err, data){
                if(err){
                    log(err);
                    db.close();
                    deferred.reject(err);
                    return;
                }

                if (data.result.ok === 1 ) {
                    log(JSON.stringify(data));
                    db.close();
                    deferred.resolve(data.insertedIds[0]);
                    return;
                }
                db.close();
                deferred.resolve(false);
            });
        });
    });

    return deferred.promise;
};

UrlDb.prototype.removeUrl = function(dbKey) {
    console.log(dbKey);
    var searchUrl = this.db.urls.find({ _id: dbKey });
    if (searchUrl) {
        this.uriMap[dbKey] = undefined;
        this.db.urls.remove(dbKey);
    } else {
        console.log('could not find url with key: ' + dbKey + ' .');
    }
};

UrlDb.prototype.removeUrlCollection = function() {
    var deferred = q.defer();
    this.db.open(function(err, db){
        if(err){
            log(err);
            db.close();
            deferred.reject(err);
            return;
        }
        db.collection('urls').drop(function(err, collection){
            if(err){
                log(err);
                db.close();
                deferred.reject(err);
                return;
            }
            db.close();
            deferred.resolve(collection);
            return;
        });
    });

    return deferred.promise;
};

module.exports = UrlDb;
