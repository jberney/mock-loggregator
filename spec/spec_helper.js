const http = require('http');

const host = 'localhost';

module.exports = {
    assertCatch: (expected, done) => {
        return e => {
            expect(e).toEqual(expected);
            done();
        };
    },
    assertResponse: (expected) => {
        return actual => {
            expect(actual).toEqual(expected);
        };
    },
    caught: (done) => {
        return e => {
            expect(e).toBeFalsy();
            done();
        };
    },
    request: ({method = 'get', port, path, body}) => {
        return new Promise((resolve, reject) => {
            const req = http.request({
                method,
                host,
                port,
                path
            }, response => {
                const contentType = response.headers['content-type'];
                const boundary = contentType.split(/\s*;\s*/)
                    .reduce((memo, pair) => {
                        if (memo) return memo;
                        const pairElements = pair.split('=');
                        if (pairElements[0] === 'boundary')
                            return pairElements[1];
                    }, null);
                if (!boundary) reject(new Error('boundary not found'));
                const chunks = [];
                response.on('data', function (chunk) {
                    chunks.push(chunk);
                });
                response.on('end', function () {
                    const body = Buffer.concat(chunks);
                    resolve({boundary, body});
                });
            });
            body && req.write(JSON.stringify(body));
            req.end();
        });
    }
};