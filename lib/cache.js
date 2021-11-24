const _ = require('underscore');
let map = new Map();

module.exports = {
	get: function(key, options) {
		options = _.defaults(options || {}, {
			maxAge: 5 * 60 * 1000,
		});
		let data = null;
		try {
			const value = map.get(key);
			if (value) {
				const item = JSON.parse(value);
				data = item.data;
				if (options.maxAge) {
					const { timestamp } = item;
					const expired = timestamp < Date.now() - options.maxAge;
					if (expired) {
						data = null;
						map.delete(key);
					}
				}
			}
		} catch (error) {
			return Promise.reject(error);
		}
		return Promise.resolve(data);
	},
	set: function(key, data) {
		try {
			const timestamp = Date.now();
			const item = { data, timestamp };
			const value = JSON.stringify(item);
			map.set(key, value);
		} catch (error) {
			return Promise.reject(error);
		}
		return Promise.resolve(data);
	},
};
