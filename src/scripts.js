var fs = require('fs');

module.exports = {
        app: function(callback) {
            openTemplate('./src/views/app.js', callback);
        }
};

function openTemplate(filepath, callback) {
    fs.readFile(filepath, function(err, file){
        callback(file.toString());
    });
}
