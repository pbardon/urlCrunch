#!/usr/bin/node
'use strict';


var http = require('http'),
url = require('url'),
fs = require('fs'),
q = require('q'),
url = require('url'),
router = require('./router'),
templates = require('./templates'),
UrlDb = require('./UrlDb'),
devDb = 'mongodb://localhost:27017/dev';


var httpServer = function(db) {
    return http.createServer(function (req, res) {
        var uri = url.parse(req.url).pathname,
        body = req.body,
        method = req.method,
        requestProcessor,
        payload,
        errorMessage;

        try {
            processPostData(req, function(body) {
                if(body) {
                    body = JSON.parse(body);

                }
                console.log('Incoming ' + method + ' request at uri: ' + uri);
                console.log(body);
                if (uri.slice(0, 5) === '/link') {
                    console.log('routing link request');
                    requestProcessor = router.resolve(method);
                    console.log('handling request with ' +
                     requestProcessor.name + ' processor');
                    requestProcessor.call({}, db, uri, body, res)
                    .then(function(response, data){
                        console.log('responding to request with data:');
                        handleResponse(response, data);
                    }, function(err) {
                        console.log('hit some kind of error');
                        handleError(res, err);
                    });
                }else if(uri.slice(0, 1) == '/' && method === 'GET') {
                    console.log('Serving home page content');
                    templates.home(function(template) {
                        payload = template;
                        handleResponse(res, payload, true);
                    });
                }else {
                    console.log('Could not resolve uri');
                    console.log(uri);
                    console.log(method);
                    handleError(res, 'Could not resolve URI');
                }
            });
        } catch(ex) {
            handleError(res, ex);
        }
    });
};

startServer();

function startServer(callback) {
    var urlDb = new UrlDb(devDb);

    urlDb.initialize().then(function(){
        console.log('starting server');
        httpServer(urlDb).listen(1337);
        callback();
    }, function(err){
        console.log(err);
        throw err;
    });
}

function handleError(response, error) {
    var errorMessage;
    response.writeHead(200, {
        'Content-Type': 'application/json'
    });
    errorMessage = error.toString();
    response.end(JSON.stringify({
        error: errorMessage
    }));
}

function handleResponse(response, payload, isHtml) {
    var contentType;
    if (!isHtml) {
        contentType = 'application/json';
        payload = JSON.stringify(payload);
    }else{
        contentType = 'text/html';
    }
    if (!response.statusCode) {
        response.writeHead(200, {
            'Content-Type': contentType
        });
    }
    response.end(payload);
}

function processPostData(request, callback) {
    var postData = "";
    if(typeof callback !== 'function') return null;

    if(request.method === 'POST') {
        request.on('data', function(data) {
            postData += data;
            if(postData.length > 1e6) {
                postData = "";
                request.connection.destroy();
            }
        });

        request.on('end', function() {
            console.log('handling post data:');
            console.log(postData);

            return callback(postData);
        });

    }else {
        callback();
    }
}

module.exports = {
    httpServer: httpServer,
    handleError: handleError,
    startServer: startServer,
    handleResponse: handleResponse
};
