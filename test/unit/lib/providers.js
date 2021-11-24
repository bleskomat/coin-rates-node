const _ = require('underscore');
const { expect } = require('chai');

describe('lib/providers', function() {

	const coinRates = require('../../../');

	const toCurrency = {
		'poloniex': 'USD',
	};

	_.chain(coinRates.providers).pluck('name').each(provider => {
		describe(provider, function() {
			it('get([options])', function() {
				this.timeout(5000);
				let options = {
					provider,
					currencies: {
						from: 'BTC',
						to: toCurrency[provider] || 'EUR',
					},
				};
				return coinRates.get(options).then(rate => {
					expect(rate).to.not.be.null;
					expect(rate).to.be.a('string');
					const asNumber = parseFloat(rate);
					expect(asNumber).to.be.a('number');
					expect(asNumber > 0).to.equal(true);
					return coinRates.get(options).then(rate2 => {
						expect(rate2).to.equal(rate);
					});
				});
			});
		});
	});
});
