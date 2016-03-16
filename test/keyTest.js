var key = require('../src/key');

exports.testGenerateKey = function(test) {
    var generatedKey = key.generateKey('www.google.com');

    test.ok(generatedKey.length === 6, 'key length is 6 digits');
    test.ok(generatedKey === generatedKey.toUpperCase(), 'keys is all uppercase');

    test.done();
};
