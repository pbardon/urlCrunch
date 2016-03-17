var q = require('q');
var key = require('./key');


function onGet(db, url) {
    var deferred = q.defer();
    console.log('GET:');

    //Parse url
    var key = url.slice(6);
    //Resolve via Route Map
    if (db.uriMap[key]) {
        //Return expanded url

        deferred.resolve();
    }else {
        deferred.reject('Could not resolve url using key: ' + key);
    }

    return deferred.promise;
}

function onPost(db, uri) {
    var deferred = q.defer();

    console.log('POST:');

    //Create new uri
    var generatedKey = key.generateKey(uri);

    //Attempt to save to hash

    //If there is a collision, add X random characters

    //Save to Route Map

    //Return shortened url

    return deferred.promise;

}

function onDelete(db, uri) {
    var deferred = q.defer();

    //Parse uri

    //Find in route map

    //Remove from route map

    //return expanded url

    console.log('DELETE:');

    return deferred.promise;
}

module.exports = {
    onGet: onGet,
    onPost: onPost,
    onDelete: onDelete
};
