const {Router} = require('express');

const MockLoggregator = require('./mock_loggregator');

module.exports = {
    newRouter({state, LoggregatorEncoder}) {
        const router = new Router();
        router.get('/apps/:appGuid/recentlogs',
            MockLoggregator.getRecentLogs({state, LoggregatorEncoder}));
        return router;
    }
};