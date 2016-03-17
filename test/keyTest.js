var key = require('../src/key');

exports.testGenerateKey = function(test) {
    var keyLength = 6;
    var generatedKey = key.generateKey('www.google.com', keyLength);
    test.ok(generatedKey.length === keyLength, 'key length is 6 digits');
    var generatedKey2 = key.generateKey('www.google.com', keyLength);
    test.ok(generatedKey !== generatedKey2, 'second generated key is different than first');
    keyLength = keyLength + 1;
    var generatedKey3 = key.generateKey('www.google.com', keyLength);
    test.ok(generatedKey3.length === keyLength, 'key length can be increased');
    test.ok(generatedKey === generatedKey.toUpperCase(), 'keys is all uppercase');

    test.done();
};
