const _ = require('underscore');
const cache = require('./cache');
const fetch = require('./fetch');

module.exports = function(options) {
	options = options || {};
	const key = JSON.stringify(_.pick(options, 'provider', 'currencies'));
	return cache.get(key, options.cache).then(fromCache => {
		if (fromCache) return fromCache;
		return fetch(options).then(fromProvider => {
			return cache.set(key, fromProvider);
		});
	});
};
