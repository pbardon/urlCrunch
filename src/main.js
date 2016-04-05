#!/usr/bin/node
'use strict';


var http = require('http'),
url = require('url'),
fs = require('fs'),
q = require('q'),
url = require('url'),
router = require('./router'),
templates = require('./templates'),
scripts = require('./scripts'),
UrlDb = require('./UrlDb'),
config = require('./config'),
dbAddress = 'mongodb://'+ config.dbAddress +':27017/production';

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
            processPostData(req, function(body) {
                if (uri.slice(0, 5) === '/link') {
                    console.log('routing link request');
                    requestProcessor = router.resolve(method);
                    console.log('handling request with ' +
                     requestProcessor.name + ' processor');
                    requestProcessor.call({}, db, uri, body, res)
                    .then(function(resolved){
                        handleResponse(resolved.response, resolved.data);
                    }, function(err) {
                        console.log('There was some kind of error while processing the request');
                        console.log(err.message);
                        handleError(res, err);
                    });
                }else if(uri.slice(0, 7) == '/script' && method === 'GET') {
                    console.log('Serving home page content');
                    scripts.app(function(script) {
                        payload = script;
                        handleResponse(res, payload, true);
                    });
                }
                else if(uri.slice(0, 1) == '/' && method === 'GET') {
                    console.log('Serving home page content');
                    templates.home(function(template) {
                        payload = template;
                        handleResponse(res, payload, true);
                    });
                }
                else {
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
    console.log(dbAddress);
    console.log('using mongodb located at ' + dbAddress);

    var urlDb = new UrlDb(dbAddress);
    urlDb.initialize().then(function(){
        console.log('starting server');
        console.log('on port:');
        var port = config.port;
        console.log(port);
        httpServer(urlDb).listen(config.port);
        callback();
    }, function(err){
        console.log(err);
        throw err;
    });
}

function handleError(response, error) {
    var errorMessage;
    response.writeHead(500, {
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
            postData = parseFormPostData(postData);
            return callback(postData);
        });

    }else {
        callback();
    }
}

function parseFormPostData(data) {
    var postData = {};
    if (data.length > 4 && data.slice(0, 4) == 'url=') {
        postData.url = data.slice(4);
    }else if (data) {
        postData = data;
    }else{
        postData = {};
    }
    return postData;
}

module.exports = {
    httpServer: httpServer,
    handleError: handleError,
    startServer: startServer,
    handleResponse: handleResponse
};
