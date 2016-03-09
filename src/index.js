#!/usr/bin/node
'use strict';


var http = require('http'),
url = require('url'),
fs = require('fs'),
q = require('q'),
router = require('router'),
templates = require('./views/templates');


var server = http.createServer(function (req, res) {
    var uri = url.parse(req.url).pathname,
    method = res.body.method,
    requestProcessor,
    payload,
    errorMessage;
    try {
        console.log('Incoming request at uri: ');
        console.log(uri);
        if (uri.startsWith('/api')) {
            requestProcessor = router.resolve(method);
            requestProcessor.call(this, res, uri)
            .then(function(data){
                handleResponse(res, data);
            }, function(err) {
                handleError(res, err);
            });
        }else if(uri === '/' && method === 'GET') {
            templates.home(function(template) {
                payload = { template: template };
                handleResponse(res, payload);
            });
        }else {
            handleError(res, 'Could not resolve URI');
        }
    } catch(ex) {
        handleError(res, ex);
    }
});

server.listen(1337);


function handleError(response, error) {
    var errorMessage;
    response.writeHead(200, {
        'Content-Type': 'application/json'
    });
    errorMessage = error.toString();
    response.end({
        error: errorMessage
    });
}

function handleResponse(response, payload) {
    response.writeHead(200, {
        'Content-Type': 'application/json'
    });

    response.end(payload);
}

module.exports = {
    server: server,
    handleError: handleError,
    handleResponse: handleResponse
};
