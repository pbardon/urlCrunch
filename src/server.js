var q = require('q');
var key = require('./key');


function onGet(urlDb, uri, body, response) {
    var deferred = q.defer();
    console.log('GET:');

    //Parse key from url
    var key = uri.slice(6);

    // Try to find key in url db.
    console.log(key);
    urlDb.getUrl(key).then(function(urlObject){
        if (urlObject) {
            response.writeHead(301, {
                'Location' : 'http://' + urlObject.url
            });
            return deferred.resolve([response, urlObject]);
        }
        return deferred.reject(new Error(
            'Url object with key: ' + key + ' not found.'));
    });

    return deferred.promise;
}

function onPost(urlDb, uri, body, response) {
    var deferred = q.defer(),
    url;
    console.log('starting onPost');
    console.log('POST:');
    try {

        if (!body.url) {
            console.log('URL is missing from post body');
            var err = new Error('URL is missing from post body');
            deferred.reject(err);
        }

        url = body.url;
        key.generateKey(url, 6);

        if(url.length < 1) {
            return deferred.reject(new Error('no url provided'));
        }
        //Create new uri
        var generatedKey = key.generateKey(url, 6);

        urlDb.addUrl(generatedKey, url).then(function(urlObject){
            if (urlObject){
                return deferred.resolve([response, urlObject]);
            }
            return deferred.reject(new Error(
                'Unable to add url:' + url +
                ' with key: ' + generatedKey + 'to database'));
        }, function(err){
            deferred.reject(err);
        });
    }catch(ex) {
        console.log(ex);
        deferred.reject(ex);
    }

    return deferred.promise;
}

function onDelete(urlDb, url, body, response) {
    var deferred = q.defer();

    //Parse uri
    console.log('DELETE:');

    //Parse key from url
    var key = url.slice(6);

    urlDb.removeUrl(key).then(function(urlObject) {
        if(urlObject){
            return deferred.resolve([response, urlObject]);
        }

        return deferred.reject(new Error('could not remove url with key: ' + key));
    });

    return deferred.promise;
}

module.exports = {
    onGet: onGet,
    onPost: onPost,
    onDelete: onDelete
};
