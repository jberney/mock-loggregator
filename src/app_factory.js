const express = require('express');

const RouterFactory = require('./router_factory');

module.exports = {
    newApp({state, LoggregatorEncoder}) {
        const app = express();
        app.use(function (req, res, next) {
            let log = `[LOG] ${req.method} ${req.url}`;
            if (['POST', 'PUT'].includes(req.method)) log = `${log} ${JSON.stringify(req.body)}`;
            console.log(log);
            next();
        });
        app.use(RouterFactory.newRouter({state, LoggregatorEncoder}));
        return app;
    }
};