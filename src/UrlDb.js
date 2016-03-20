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
    MongoClient.connect(this.mongoUri, function(err, urlDatabase){
        if (err){
            console.log(err);
            return deferred.reject(err);
        }

        urlDatabase.open(function(err, db){
            if (err){
                console.log(err);
                return deferred.reject(err);
            }
            oThis.db = db;
            deferred.resolve(db);
        });
    });

    return deferred.promise;
};


UrlDb.prototype.loadUrlCollection = function() {
    var deferred = q.defer(),
    collectionNames,
    urlCollection,
    oThis = this;
    this.db.collections(function(err, data){
        if (err) {
            log(err);
            deferred.reject(err);
            return;
        }
        //Check to see if the collection exists..
        data.forEach(function(item) {
            log(item.s.name);
            if (item.s.name === 'urls'){
                urlCollection = item;
            }
            return item.s.name;
        });
        //Check to make sure it exists..
        if(!urlCollection){
            //Create the collection if it doesn't exist.
            console.log('creating new collection');

            console.log(oThis.db.createCollection);


            try {
                urlCollection = oThis.db.createCollection('urls');
                return deferred.resolve(urlCollection);
            }catch(ex) {
                log(ex);
                deferred.reject(ex);
            }
        }

        console.log('returning existing collection');

        //Otherwise just return the collection...
        deferred.resolve(urlCollection);
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
        log('found object');
        log(urlObject);
        if (!urlObject) {
            log('about to insert url object');
            return oThis.insertUrlObject(dbKey, url).then(function(obj){
                log('inserted url object');
                log(obj);
                deferred.resolve(obj);

            }, function(err){
                deferred.reject(err);
            });
        }

        log('generating new key');

        dbKey = key.generateKey(url, dbKey.length + 1);
        oThis.addUrl(dbKey, url).then(function(data){
            log('added url with new key');
            deferred.resolve(data);
        });
    });

    return deferred.promise;
};

UrlDb.prototype.findById = function(dbKey) {
    var deferred = q.defer(),
    urlList;
    this.loadUrlCollection().then(function(urlCollection){
        log('loaded urlCollection');
        log('loaded urlCollection********');

        log('collection');
        urlCollection.find({ _id: dbKey}).toArray(function(err, data){
            if (err) {
                log(err);
                return deferred.reject(err);
            }

            log(data);

            if(!data[0]){
                log('could not find url with key: '+ dbKey);
                deferred.resolve(false);
                return;
            }
            return deferred.resolve(data[0]);
        });
    });
    return deferred.promise;
};

UrlDb.prototype.insertUrlObject = function(dbKey, url){
    var deferred = q.defer(),
    oThis = this;
    this.loadUrlCollection().then(function(urlCollection){
        urlCollection.insert({ _id: dbKey, url: url}, function(err, data){
            if(err){
                log(err);
                deferred.reject(err);
                return;
            }

            if (data.result.ok === 1 ) {
                return deferred.resolve(data.insertedIds[0]);
            }
            return deferred.resolve(false);
        });
    });

    return deferred.promise;
};

UrlDb.prototype.removeUrl = function(dbKey) {
    var deferred = q.defer();
    this.loadUrlCollection().then(function(urlCollection){
        log('loaded urlCollection');
        urlCollection.remove({ '_id': dbKey }, function(err, data) {
            log('removed urlCollection');
            if (err) {
                log(err);
                return deferred.reject(err);
            }
            return deferred.resolve(data);
        });
    });
    return deferred.promise;
};

UrlDb.prototype.removeUrlCollection = function() {
    var deferred = q.defer();
    this.loadUrlCollection().then(function(urlCollection){
        log('loaded urlCollection');
        try {
            urlCollection.drop();
            log('removed url collection');
            return deferred.resolve(urlCollection);

        }catch (ex){
            log(ex);
            return deferred.reject(ex);
        }
    });

    return deferred.promise;
};

module.exports = UrlDb;
