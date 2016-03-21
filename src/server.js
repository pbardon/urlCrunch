var q = require('q');
var key = require('./key');


function onGet(urlDb, uri) {
    var deferred = q.defer();
    console.log('GET:');

    //Parse key from url
    var key = url.slice(6);
    //Try to find key in url db.
    urlDb.findById(key).then(function(urlObject){
        if (urlObject) {
            return deferred.resolve(urlObject);
        }
        return deferred.reject(new Error(
            'Url object with key: ' + key + ' not found.'));
    });

    return deferred.promise;
}

function onPost(urlDb, url, body) {
    var deferred = q.defer();

    console.log('POST:');

    //Create new uri
    var generatedKey = key.generateKey(url);

    urlDb.addUrl(generatedKey, url).then(function(urlObject){
        if (urlObject){
            return deferred.resolve(urlObject);
        }
        return deferred.reject(new Error(
            'Unable to add url:' + url +
            ' with key: ' + generatedKey + 'to database'));
    });

    return deferred.promise;

}

function onDelete(urlDb, uri) {
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
