let map = new Map();

module.exports = {
	get: function(key, options) {
		return Promise.resolve().then(() => {
			options = Object.assign({}, {
				maxAge: 5 * 60 * 1000,
			}, options || {});
			let data = null;
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
			return data;
		});
	},
	set: function(key, data) {
		return Promise.resolve().then(() => {
			const timestamp = Date.now();
			const item = { data, timestamp };
			const value = JSON.stringify(item);
			map.set(key, value);
			return data;
		});
	},
};
