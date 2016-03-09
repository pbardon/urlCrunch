var templates = require('../src/templates'),
fs = require('fs');


exports.testHomeTemplate = function(test) {
    try {        
        console.log('starting home template test');
        templates.home(function(file) {
            test.ok(file  === '<html><head></head><body>This is the body for the home page</body></html>', 'Home content is loaded');
        });
        test.done();

    }catch (ex) {
        console.log('in catch statement');
        console.log(ex.toString());
    }
};
