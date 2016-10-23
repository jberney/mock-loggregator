const http = require('http');

const AppFactory = require('./app_factory');

module.exports = {
    newServer({state, LoggregatorEncoder, port}, callback) {
        return http.createServer(AppFactory.newApp({state, LoggregatorEncoder}))
            .listen(port, callback);
    }
};