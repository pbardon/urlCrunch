(function() {
    'use strict';
    var q = require('q'),
    key = require('./key'),
    url = require('url');

    function onGet(urlDb, uri, body, response) {
        var deferred = q.defer(),
        scheme;
        console.log('GET:');
        console.log(uri);


        //Parse key from url
        var key = uri.slice(6);

        // Try to find key in url db.
        console.log(key);
        urlDb.getUrl(key).then(function(urlObject){
            if (urlObject) {
                var scheme = '';
                if (!urlObject.url.startsWith('http')) {
                    scheme = 'http://';
                }
                var redirectUrl = scheme + urlObject.url;
                response.writeHead(301, {
                    'Location' :redirectUrl
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
        var urlLinkToCreate;
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
        console.log(body.url);
        var parsedUrl;
        if (!body.url) {
            console.log('URL is missing from post body');
            throw new Error('URL is missing from post body');
        }
        //Decode Uri if it was encoded in transit...
        parsedUrl = unescape(body.url);

        console.log(url.parse(parsedUrl));

        if (!parsedUrl) {
            console.log('There was some problem decoding the url');
            throw new Error('URL was not decoded');
        }

        if (!isUrl(parsedUrl)) {
            console.log('URL passed in was not a legitimate url.');
            throw new Error('URL passed in was not a legitimate url.');
        }

        if(url.length < 1) {
            throw new Error('no url provided');
        }

        return parsedUrl;
    }

    function isUrl(urlToCheck) {
        var expression = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi;
        var regex = new RegExp(expression);
        var result = regex.test(urlToCheck);
        return result;
    }

    module.exports = {
        onGet: onGet,
        onPost: onPost,
        onDelete: onDelete
    };
}());
