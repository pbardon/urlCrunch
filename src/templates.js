(function(){
    'use strict';
    var fs = require('fs');

    module.exports = {
            home: function(callback) {
                openTemplate('./src/views/home.html', callback);
            }
    };

    function openTemplate(filepath, callback) {
        fs.readFile(filepath, function(err, file){
            callback(file.toString());
        });
    }
}());
