var router = require('../src/router');

exports.testResolve = function(test) {
    test.expect(6);
    var get = router.resolve('GET'),
    post = router.resolve('POST'),
    del = router.resolve('DELETE');
    test.ok(get.name === 'onGet', 'Get resolved');
    test.ok(post.name === 'onPost', 'Post resolved');
    test.ok(del.name === 'onDelete', 'Delete resolved');

    try {
        incorrect = router.resolve('FOO');
    } catch(err) {
        test.ok(err.message == 'Could not resolve REST method');
    }
    try {
        incorrect2 = router.resolve('FOkljglkfdjglkdfjgO');
    } catch(err) {
        test.ok(err.message == 'Could not resolve REST method');
    }
    try {
        empty = router.resolve('');
    } catch(err) {
        test.ok(err.message == 'Could not resolve REST method');
    }

    test.done();
};
