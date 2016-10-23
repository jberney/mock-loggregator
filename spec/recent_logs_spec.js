const {request, assertResponse, caught} = require('./spec_helper');

describe('Apps API', () => {

    const port = Math.round(1000 + Math.random() * 60000);

    let ServerFactory, server;
    beforeEach(() => {
        ServerFactory = require('../src/server_factory');
    });

    afterEach(() => {
        server && server.close();
    });

    describe('GET /v2/apps/:guid/recentlogs', () => {

        let state, MockLoggregator;

        beforeEach(() => {
            state = {};
            MockLoggregator = require('../src/mock_loggregator');
        });

        describe('when there are logs', () => {
            beforeEach(done => {
                state.APP_GUID = [{
                    message: Buffer.from('hello, world!'),
                    message_type: 'OUT',
                    timestamp: 1000 * Date.now()
                }];
                server = ServerFactory.newServer({
                    state,
                    port
                }, done);
            });
            it('Get recent logs for an App', done => {
                const method = 'get';
                const path = '/apps/APP_GUID/recentlogs';
                request({method, port, path})
                    .then(({body, boundary}) => {
                        const protoStart = body.indexOf(`--${boundary}\n\n\r\n`) + boundary.length + 6;
                        const protoEnd = body.indexOf(`\n\n--${boundary}`, protoStart);
                        const buffer = body.slice(protoStart, protoEnd);
                        const envelope = MockLoggregator.events.Envelope
                            .decode(buffer);

                        expect(envelope.origin).toBe('MockLoggregator');
                        expect(envelope.eventType).toBe(5);
                        expect(envelope.logMessage.message.toString('utf8'))
                            .toBe(state.APP_GUID[0].message.toString('utf8'));
                        expect(envelope.logMessage.message_type)
                            .toBe(1);
                        expect(parseInt(envelope.logMessage.timestamp, 10))
                            .toBe(state.APP_GUID[0].timestamp);

                    })
                    .then(done)
                    .catch(caught(done));
            });
        });

        describe('when the app does not exist', () => {

            beforeEach(done => {
                server = ServerFactory.newServer({
                    state,
                    port
                }, done);
            });

            it('Get no logs for the App', done => {
                const method = 'get';
                const path = '/apps/APP_GUID/recentlogs';
                request({method, port, path})
                    .then(({body, boundary}) => {
                        expect(body).toEqual(Buffer.from(`\n\n--${boundary}--`));
                    })
                    .then(done)
                    .catch(caught(done));
            });

        });

    });

});