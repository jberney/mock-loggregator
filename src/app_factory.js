const express = require('express');

const RouterFactory = require('./router_factory');

module.exports = {
    newApp(state) {
        const app = express();
        app.use(function (req, res, next) {
            let log = `[LOG] ${req.method} ${req.url}`;
            console.log(log);
            next();
        });
        app.use(RouterFactory.newRouter(state));
        return app;
    }
};