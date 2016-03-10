var q = require('q'),
server = require('./server');

module.exports = {
    resolve: function(method) {
        var requestProcessor;
        switch (method) {
            case 'GET':
                requestProcessor = server.onGet;
                break;
            case 'POST':
                requestProcessor = server.onPost;
                break;
            case 'DELETE':
                requestProcessor = server.onDelete;
                break;
            default:
                throw new Error('Could not resolve REST method');
        }
        return requestProcessor;
    }
};
