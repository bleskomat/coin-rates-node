const assert = require('assert');
const async = require('async');
const formatText = require('./formatText');
const http = require('http');
const https = require('https');
const providers = require('./providers');
const url = require('url');

const noop = function() {};

module.exports = function(options) {
	return Promise.resolve().then(() => {
		options = Object.assign({}, {
			currencies: {
				from: null,
				to: null,
			},
			retry: {
				// See https://caolan.github.io/async/v3/docs.html#retry
				errorFilter: function(error) {
					if (error instanceof Error) return false;
					if (typeof error.status !== 'undefined') {
						if (error.status === 0) return false;
						if (error.status >= 400 && error.status <= 499) return false;
					}
					return true;
				},
				interval: 5000,
				times: 3,
			},
			provider: null,
		}, options || {});
		assert.ok(options.currencies, 'Missing required option: "currencies"');
		assert.strictEqual(typeof options.currencies, 'object', 'Invalid option ("currencies"): Object expected');
		assert.ok(options.currencies.from, 'Missing required option: "currencies.from"');
		assert.ok(options.currencies.to, 'Missing required option: "currencies.to"');
		assert.strictEqual(typeof options.currencies.from, 'string', 'Invalid option ("currencies.from"): String expected');
		assert.strictEqual(typeof options.currencies.to, 'string', 'Invalid option ("currencies.to"): String expected');
		assert.ok(options.provider, 'Missing required option: "provider"');
		let provider = providers.find(provider => {
			return provider.name === options.provider;
		});
		assert.ok(provider, `Unknown provider: "${options.provider}"`);
		assert.ok(provider.url, 'Missing provider config: "url"');
		assert.ok(typeof provider.convertSymbols === 'undefined' || typeof provider.convertSymbols === 'object', 'Invalid provider config ("convertSymbols"): Object expected');
		if (typeof provider.parseResponseBody === 'undefined') {
			provider.parseResponseBody = noop;
		}
		assert.strictEqual(typeof provider.parseResponseBody, 'function', 'Invalid provider config ("parseResponseBody"): Function expected');
		let currencies = {};
		Object.entries(options.currencies).forEach(function([key, symbol], index) {
			if (provider.convertSymbols && provider.convertSymbols[symbol]) {
				symbol = provider.convertSymbols[symbol];
			}
			currencies[key.toLowerCase()] = symbol.toLowerCase();
			currencies[key.toUpperCase()] = symbol.toUpperCase();
		});
		const uri = formatText(provider.url, currencies);
		return new Promise((resolve, reject) => {
			async.retry(
				options.retry,
				function(next) {
					try {
						const parsedUrl = url.parse(uri);
						const request = parsedUrl.protocol === 'https:' ? https.request : http.request;
						const req = request(uri, function(res) {
							let body = '';
							res.on('data', function(data) {
								body += data.toString();
							});
							res.on('end', function() {
								let result;
								try {
									result = provider.parseResponseBody(body, currencies) || null;
									if (typeof result === 'number') {
										result = result.toString();
									}
								} catch (error) {
									return next(error);
								}
								next(null, result);
							});
						});
						req.on('error', error => {
							next(error);
						});
						req.end();
					} catch (error) {
						return next(error);
					}
				},
				(error, result) => {
					if (error) return reject(error);
					resolve(result);
				},
			);
		});
	});
};
