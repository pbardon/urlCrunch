#!/usr/bin/node
'use strict';


var http = require('http'),
url = require('url'),
fs = require('fs'),
q = require('q'),
router = require('./router'),
templates = require('./templates');


var httpServer = http.createServer(function (req, res) {
    var uri = url.parse(req.url).pathname,
    body = req.body,
    method = req.method,
    requestProcessor,
    payload,
    errorMessage;

    for (var i in req) {
        console.log(i);
    }

    try {
        console.log('Incoming request at uri: ');
        console.log(uri);
        console.log(method);
        console.log("SLICE:");
        console.log(uri.slice(4));
        console.log(uri.slice(1));


        if (uri.slice(0, 4) == '/api') {
            console.log('serving api content');
            requestProcessor = router.resolve(method);
            requestProcessor.call(this, res, uri)
            .then(function(data){
                handleResponse(res, data);
            }, function(err) {
                handleError(res, err);
            });
        }else if(uri.slice(0, 1) == '/' && method === 'GET') {
            console.log('Serving home content');
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

httpServer.listen(1337);


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
