const cache = require('./cache');
const fetch = require('./fetch');

module.exports = function(options) {
	options = options || {};
	const { provider, currencies } = options;
	const key = JSON.stringify({ provider, currencies });
	return cache.get(key, options.cache).then(fromCache => {
		if (fromCache) return fromCache;
		return fetch(options).then(fromProvider => {
			return cache.set(key, fromProvider);
		});
	});
};
