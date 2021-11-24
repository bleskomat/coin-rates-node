const _ = require('underscore');

module.exports = function(text, data) {
	_.chain(data)
		.pick('from', 'to', 'FROM', 'TO')
		.each(function(value, key) {
			text = text.replace(`{{${key}}}`, value);
		});
	return text;
};
