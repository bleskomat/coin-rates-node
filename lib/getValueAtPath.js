const _ = require('underscore');

module.exports = function(data, path) {
	// Deep clone to prevent mutation of original data object.
	data = JSON.parse(JSON.stringify(data));
	let parts = path.split('.');
	let key;
	while (
		!_.isUndefined(data) &&
		_.isObject(data) &&
		parts.length > 0 &&
		(key = parts.shift())
	) {
		data = data[key];
	}
	return data;
};
