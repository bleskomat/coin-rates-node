const _ = require('underscore');
const async = require('async');
const formatText = require('./formatText');
const http = require('http');
const https = require('https');
const providers = require('./providers');
const url = require('url');

module.exports = function(options) {
	try {
		options = _.defaults(options || {}, {
			currencies: {
				from: null,
				to: null,
			},
			retry: {
				// See https://caolan.github.io/async/v3/docs.html#retry
				errorFilter: function(error) {
					if (error instanceof Error) return false;
					if (!_.isUndefined(error.status)) {
						if (error.status === 0) return false;
						if (error.status >= 400 && error.status <= 499) return false;
					}
					return true;
				},
				interval: 5000,
				times: 3,
			},
			provider: null,
		});
		if (!options.currencies) {
			throw new Error('Missing required option: "currencies"');
		}
		if (!_.isObject(options.currencies)) {
			throw new Error('Invalid option ("currencies"): Object expected');
		}
		if (!_.isString(options.currencies.from)) {
			throw new Error('Invalid option ("currencies.from"): String expected');
		}
		if (!_.isString(options.currencies.to)) {
			throw new Error('Invalid option ("currencies.to"): String expected');
		}
		if (!options.provider) {
			throw new Error('Missing required option: "provider"');
		}
		if (!_.isString(options.provider)) {
			throw new Error('Invalid option ("provider"): String expected');
		}
		let provider = _.findWhere(providers, { name: options.provider });
		if (!provider) {
			throw new Error(`Unknown provider: "${options.provider}"`);
		}
		if (!provider.url) {
			throw new Error('Missing provider config: "url"');
		}
		if (!_.isUndefined(provider.convertSymbols) && !_.isObject(provider.convertSymbols)) {
			throw new Error('Invalid provider config ("convertSymbols"): Object expected');
		}
		if (_.isUndefined(provider.parseResponseBody)) {
			provider.parseResponseBody = _.noop;
		}
		if (!_.isFunction(provider.parseResponseBody)) {
			throw new Error('Invalid provider config ("parseResponseBody"): Function expected');
		}
		let currencies = {};
		_.each(options.currencies, function(symbol, key) {
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
									if (_.isNumber(result)) {
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
	} catch (error) {
		return Promise.reject(error);
	}
};
