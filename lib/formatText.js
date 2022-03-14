module.exports = function(text, data) {
	const { from, to, FROM, TO } = data;
	text = text.replace(`{{from}}`, from);
	text = text.replace(`{{to}}`, to);
	text = text.replace(`{{FROM}}`, FROM);
	text = text.replace(`{{TO}}`, TO);
	return text;
};
