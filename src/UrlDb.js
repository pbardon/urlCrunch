(function() {
    'use strict';

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
        var collectionNames,
        oThis = this;
        MongoClient.connect(this.mongoUri, function(err, database){
            if (err){
                console.log(err);
                return deferred.reject(err);
            }

            database.open(function(err, db){
                oThis.db = db;
                deferred.resolve();
            });
        });

        return deferred.promise;
    };

    UrlDb.prototype.initialize = function() {
        var deferred = q.defer(),
        oThis = this;
        this.connect().then(function(){
            oThis.createUrlCollection().then(function(){
                deferred.resolve();
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
        var deferred = q.defer(),
        oThis = this;
        loadUrlCollection(this.db).then(function(urlCollection){
            if (!urlCollection) {
                deferred.reject(new Error('Could not load url collection'));
            }
            urlCollection.find({ _id: dbKey }).toArray(function(err, data){
                log('found');
                log(data);
                if(data[0]) {
		    log('resolving promise....');
                    return deferred.resolve(data[0]);
                }else {
                    return deferred.resolve(false);
                }
            });
        });
        return deferred.promise;
    };


    UrlDb.prototype.addUrl = function(dbKey, url) {
        var deferred = q.defer(),
        oThis = this;
        //Check for key collision
        this.findById(dbKey).then(function(urlObject){
            if (!urlObject) {
                //Insert into database if no object is found with key
                return oThis.insertUrlObject(dbKey, url).then(function(obj){
                    deferred.resolve(obj);
                }, function(err){
                    deferred.reject(err);
                });
            }

            //Otherwise, generate a new key with an extra digit and save it.
            dbKey = key.generateKey(url, dbKey.length + 1);
            return oThis.addUrl(dbKey, url).then(function(data){
                deferred.resolve(data);
            });
        }, function(err) {
            log(err);
            deferred.reject(err);
        });

        return deferred.promise;
    };

    UrlDb.prototype.findById = function(dbKey) {
        var deferred = q.defer(),
        urlList;
        loadUrlCollection(this.db).then(function(urlCollection){
            if (!urlCollection) {
                var err = new Error('Could not load url collection');
                deferred.reject(err);
            }

            urlCollection.find({ _id: dbKey}).toArray(function(err, data){

                if (err) {
                    log(err);
                    return deferred.reject(err);
                }

                if(!data[0]){
                    //If no object is found, resolve the promise as false.
                    deferred.resolve(false);
                    return;
                }
                //If one is found, resolve with the data.
                return deferred.resolve(data[0]);
            });
        });
        return deferred.promise;
    };

    UrlDb.prototype.insertUrlObject = function(dbKey, url){
        var deferred = q.defer(),
        oThis = this;
        loadUrlCollection(this.db).then(function(urlCollection){
            if (!urlCollection) {
                deferred.reject(new Error('Could not load url collection'));
            }
            urlCollection.insert({ _id: dbKey, url: url}, {w: 1}, function(err, data){
                if(err){
                    log(err);
                    deferred.reject(err);
                    return;
                }

                //Resolve the promise with the object if it is saved successfully.
                if (data.result.ok === 1 ) {
                    log('inserted');
                    log(data);
                    log('into db');
                    return deferred.resolve(data.ops[0]);
                }
                //Otherwise, resolve the promise as false.
                return deferred.resolve(false);
            });
        });

        return deferred.promise;
    };

    UrlDb.prototype.removeUrl = function(dbKey) {
        var deferred = q.defer();
        loadUrlCollection(this.db).then(function(urlCollection){
            if (!urlCollection) {

                return deferred.reject(new Error('Could not load url collection'));
            }
            urlCollection.remove({ '_id': dbKey }, function(err, data) {

                if (err) {
                    log(err);
                    return deferred.reject(err);
                }
                if (data.result.ok === 1 ) {
                    return deferred.resolve(dbKey);

                }
                return deferred.reject(new Error('could not remove url with key: ' + dbKey));
            });
        });
        return deferred.promise;
    };

    UrlDb.prototype.createUrlCollection = function() {
        var deferred = q.defer();
        var oThis = this;
        loadUrlCollection(this.db).then(function(urlCollection){
            if(!urlCollection){
                log('creating url collection...');
                var collection = oThis.db.createCollection('urls');
                return deferred.resolve(collection);
            }
            log('loaded url collection...');
            //Just return the collection if it already exists
            deferred.resolve(urlCollection);
        });
        return deferred.promise;
    };

    UrlDb.prototype.removeUrlCollection = function() {
        var deferred = q.defer(),
        oThis = this;
        loadUrlCollection(this.db).then(function(urlCollection){
            try {
                urlCollection.drop();
                return deferred.resolve(urlCollection);
            }catch (ex){
                return deferred.reject(ex);
            }
        });
        return deferred.promise;
    };

    function loadUrlCollection(db) {
        var deferred = q.defer(),
        urlCollection;
        db.collection('urls', function(err, data){
                if (err) {
                    log(err);
                    deferred.reject(err);
                    return;
                }

                urlCollection = data;
                //Check to make sure it exists..
                if(!urlCollection){
                    //Resolve the promise as false if the url collection is not found
                    return deferred.resolve(false);
                }
                //Otherwise just return the collection...
                deferred.resolve(urlCollection);
        });


        return deferred.promise;
    }

    function urlCollectionExists(dbKey) {
        var deferred = q.defer();
        db.collections(function(err, data){
            if (err) {
                log(err);
                deferred.reject(err);
                return;
            }
            //Check to see if the collection exists..
            data.forEach(function(item) {
                if (item.s.name === 'urls'){
                    urlCollection = item;
                }
                return item.s.name;
            });
            //Check to make sure it exists..
            if(!urlCollection){
                deferred.resolve(false);
            }

            //Otherwise just return the collection...
            deferred.resolve(urlCollection);
        });
        return deferred.promise;
    }

    module.exports = UrlDb;
}());
