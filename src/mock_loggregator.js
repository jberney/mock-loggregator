const path = require('path');
const ProtoBuf = require('protobufjs');
const uuid = require('node-uuid');

const events = ProtoBuf
    .loadProtoFile(path.join(__dirname, '../proto/events.proto'))
    .build('events');

module.exports = {
    events,
    getRecentLogs(state) {
        return ({params: {appGuid}}, res) => {
            const boundary = uuid.v4();
            res.writeHead(200, {
                'Content-Type': `multipart/x-protobuf; boundary=${boundary}`
            });
            const appLogs = state[appGuid] || [];
            appLogs.forEach(log => {
                res.write(`\n\n--${boundary}\n\n\r\n`);
                res.write(new events.Envelope({
                    origin: 'MockLoggregator',
                    eventType: 'LogMessage',
                    logMessage: new events.LogMessage(log)
                }).encode().toBuffer());
            });
            res.write(`\n\n--${boundary}--`);
            res.end();
        };
    }
};