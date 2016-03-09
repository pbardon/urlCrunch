#!/usr/bin/nodeunit
'use strict';

var index = require('../src/index');

exports.testSomething = function(test) {
        test.expect(1);
        test.ok(true, 'test passes');
        test.done();
};
