var main = require('../src/main');
var http = require('http');

module.exports = {
    setUp: function(callback) {
        main.startServer(function(){
            callback();
        });
    },

    testServer: function(test) {
        console.log('starting server test');
        try {
            console.log(http.get);
            http.get({
                  hostname: 'localhost',
                  port: 1337,
                  path: '/'
              }, function(response){
                test.ok(response, 'get returns data');
                test.done();
            });
        }catch (ex) {
            console.log(ex);
        }

    }

};
