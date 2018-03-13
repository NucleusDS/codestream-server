// simple (and limited) wrapper to handle https requests that deal with json data

'use strict';

const HTTPS = require('https');
const HTTP = require('http');

function _SimpleRequest (method, host, port, path, data, callback, options) { // jshint ignore:line

    options = Object.assign({}, options || {}, { method, host, port, path });
	if (!options.noJsonInRequest) {
	    	options.headers = Object.assign({}, options.headers || {}, {
	        'Content-Type': 'application/json'
	    });
	}

    const protocol = options.useHttp ? 'HTTP' : 'HTTPS';
    let request = protocol.request(
        options,
        (response) => {
            let responseData = '';

            response.on('data', (data) => {
                responseData += data;
            });

            response.on('end', () => {
                let parsed;
				if (!options.noJsonInResponse) {
	                try {
	                    parsed = JSON.parse(responseData);
	                }
	                catch(error) {
	                    return callback(`error parsing JSON data: ${error}`);
	                }
				}
				else {
					parsed = responseData;
				}
				if (response.statusCode < 200 || response.statusCode >= 300) {
                    return callback(`error response, status code was ${response.statusCode}: ${JSON.stringify(parsed)}`, parsed);
                }
				else {
                	return callback(null, parsed);
				}
            });

            response.on('error', (error) => {
                return callback(`https error: ${error}`);
            });
        }
    );
    request.on('error', (error) => {
        callback(error);
    });
    if (data) {
        request.write(JSON.stringify(data));
    }
    request.end();
}

module.exports = {

    get: (host, port, path, data, callback, options) => {
        _SimpleRequest('get', host, port, path, data, callback, options);
    },

    post: (host, port, path, data, callback, options) => {
        _SimpleRequest('post', host, port, path, data, callback, options);
    },

    put: (host, port, path, data, callback, options) => {
        _SimpleRequest('put', host, port, path, data, callback, options);
    },

    delete: (host, port, path, data, callback, options) => {
        _SimpleRequest('delete', host, port, path, data, callback, options);
    }
};
