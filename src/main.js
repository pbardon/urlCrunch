#!/usr/bin/node
'use strict';


var http = require('http'),
url = require('url'),
fs = require('fs'),
q = require('q'),
url = require('url'),
router = require('./router'),
templates = require('./templates'),
UrlDb = require('./UrlDb');

var httpServer = function(db) {
    return http.createServer(function (req, res) {
        var uri = url.parse(req.url).pathname,
        body = req.body,
        method = req.method,
        requestProcessor,
        payload,
        errorMessage;

        try {
            console.log('Incoming ' + method + ' request at uri: ' + uri);
            if (uri.slice(0, 4) == '/link') {
                console.log('routing link request');
                requestProcessor = router.resolve(method);
                console.log('handling request with ' + requestProcessor.name + ' processor');
                requestProcessor.call({}, db, uri)
                .then(function(data){
                    console.log('responding to request with data:');
                    handleResponse(res, data);
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
        } catch(ex) {
            handleError(res, ex);
        }
    });
};


var database = new UrlDb();

database.connect().then(function(db){
    console.log('starting server')
    httpServer(db).listen(1337);
    db.close();
}, function(err){
    console.log(err);
    throw err;
});

// var rootPath = process.cwd().slice(0,-4);
//
// var db = UriDb(rootPath);

// db.loadUris().then(function() {
//     console.log('uris loaded, starting server...');
//     httpServer.listen(1337);
// }, function() {
//
// });

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
    response.writeHead(200, {
        'Content-Type': contentType
    });
    response.end(payload);
}

module.exports = {
    httpServer: httpServer,
    handleError: handleError,
    handleResponse: handleResponse
};
