var q = require('q'),
key = require('./key'),
url = require('url');

function onGet(urlDb, uri, body, response) {
    var deferred = q.defer();
    console.log('GET:');
    console.log(uri);


    //Parse key from url
    var key = uri.slice(6);

    // Try to find key in url db.
    console.log(key);
    urlDb.getUrl(key).then(function(urlObject){
        if (urlObject) {
            response.writeHead(301, {
                'Location' : 'http://' + urlObject.url
            });
            return deferred.resolve({ response: response, data: urlObject});
        }
        return deferred.reject(new Error(
            'Url object with key: ' + key + ' not found.'));
    });

    return deferred.promise;
}

function onPost(urlDb, uri, body, response) {
    var deferred = q.defer();
    console.log('starting onPost');
    console.log('POST:');
    try {

        urlLinkToCreate = parseUrl(body);
        //Create new key for link
        var generatedKey = key.generateKey(urlLinkToCreate, 6);
        urlDb.addUrl(generatedKey, urlLinkToCreate).then(function(urlObject){
            if (urlObject){
                return deferred.resolve({ response: response, data: urlObject });
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
            return deferred.resolve({ response: response, data: urlObject });
        }

        return deferred.reject(new Error('could not remove url with key: ' + key));
    });

    return deferred.promise;
}

function parseUrl(body) {
    if (!body.url) {
        console.log('URL is missing from post body');
        throw new Error('URL is missing from post body');
    }

    if (!isUrl(body.url)) {
        console.log('URL passed in was not a legitimate url.');
        throw new Error('URL passed in was not a legitimate url.');
    }

    if(body.url.length < 1) {
        throw new Error('no url provided');
    }

    return body.url;
}

function isUrl(urlToCheck) {
    try {
        parsed = url.parse(urlToCheck);
        if (parsed) {
            return true;
        }
        return false;
    }catch(ex) {
        return false;
    }
}

module.exports = {
    onGet: onGet,
    onPost: onPost,
    onDelete: onDelete
};
