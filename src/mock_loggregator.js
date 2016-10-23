const uuid = require('node-uuid');

module.exports = {
    getRecentLogs(state, LoggregatorEncoder) {
        return (req, res) => {
            const boundary = uuid.v4();
            res.writeHead(200, {
                'Content-Type': `multipart/x-protobuf; boundary=${boundary}`
            });
            const appLogs = state[req.params.appGuid] || [];
            appLogs.forEach(log => {
                res.write(`\n\n--${boundary}\n\n\r\n`);
                res.write(new LoggregatorEncoder.events.Envelope({
                    origin: 'MockLoggregator',
                    eventType: 'LogMessage',
                    logMessage: new LoggregatorEncoder.events.LogMessage(log)
                }).encode().toBuffer());
            });
            res.write(`\n\n--${boundary}--`);
            res.end();
        };
    }
};