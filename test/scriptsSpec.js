var scripts = require('../src/scripts'),
fs = require('fs');

exports.testAppScript = function(test) {
    test.expect(1);
    console.log('starting app script test');
    var appFileName = './src/views/app.js';
    fs.readFile(appFileName, 'utf8', function(err, file) {
        scripts.app(function(file) {
            test.ok(file  === file.toString(), 'App script is properly loaded');
            test.done();
        });
    });
};
