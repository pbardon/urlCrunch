function onGet(request, uri) {
    var deferred = q.defer();
    console.log('GET:');

    //Parse uri

    //Resolve via Route Map

    //Return expanded url

    return deferred.promise;
}

function onPost(request, uri) {
    var deferred = q.defer();

    console.log('POST:');

    //Create new uri


    //Generate unique uri

    //Save to DB

    //Add to Route Map

    //Return shortened url

    return deferred.promise;

}

function onDelete(request, uri) {
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
