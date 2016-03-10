var templates = require('../src/templates'),
fs = require('fs');

exports.testHomeTemplate = function(test) {
    test.expect(1);
    console.log('starting home template test');
    var homeFileName = '../src/views/home.html';
    fs.readFile(homeFileName, 'utf8', function(err, file) {
        console.log('opened file');
        console.log(homeFileName);
        console.log(file);
        templates.home(function(file) {
            test.ok(file  === file.toString(), 'Home content is properly loaded');
            test.done();
        });
    });
};
