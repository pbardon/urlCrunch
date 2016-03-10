var q = require('q');

function onGet(uri) {
    var deferred = q.defer();
    console.log('GET:');

    //Parse uri

    //Resolve via Route Map

    //Return expanded url

    return deferred.promise;
}

function onPost(uri) {
    var deferred = q.defer();

    console.log('POST:');

    //Create new uri

    //Generate unique uri

    //Attempt to save to hash

    //If there is a collision, add X random characters

    //Save to Route Map

    //Return shortened url

    return deferred.promise;

}

function onDelete(uri) {
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
