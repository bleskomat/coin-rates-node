const assert = require('assert');

describe('lib/providers', function() {

	const coinRates = require('../../../');

	const toCurrency = {
		'poloniex': 'USD',
	};

	Object.entries(coinRates.providers).forEach(function([key, provider], index) {
		const { name } = provider;
		describe(name, function() {
			it('get([options])', function() {
				this.timeout(5000);
				let options = {
					provider: name,
					currencies: {
						from: 'BTC',
						to: toCurrency[name] || 'EUR',
					},
				};
				return coinRates.get(options).then(rate => {
					assert.ok(rate);
					assert.strictEqual(typeof rate, 'string');
					const asNumber = parseFloat(rate);
					assert.strictEqual(typeof asNumber, 'number');
					assert.ok(!Number.isNaN(asNumber));
					assert.ok(asNumber > 0);
					return coinRates.get(options).then(rate2 => {
						assert.strictEqual(rate2, rate);
					});
				});
			});
		});
		return false;
	});
});
