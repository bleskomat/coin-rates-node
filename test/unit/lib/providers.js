const assert = require('assert');

describe('lib/providers', function() {

	const coinRates = require('../../../');

	const supportedTo = {
		okx: 'USD',
	};

	Object.entries(coinRates.providers).forEach(function([key, provider], index) {

		const { name } = provider;

		describe(name, function() {

			describe('get([options])', function() {

				it('supported fiat currency', function() {
					this.timeout(5000);
					const from = 'BTC';
					const to = supportedTo[name] || 'EUR';
					let options = {
						provider: name,
						currencies: { from, to },
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

				it('unsupported fiat currency', function() {
					this.timeout(5000);
					const from = 'BTC';
					const to = 'XXX';
					let options = {
						provider: name,
						currencies: { from, to },
					};
					return coinRates.get(options).then(rate => {
						throw new Error('Expected an error');
					}).catch(error => {
						assert.ok(new RegExp([
							'invalid symbol',// binance
							'unknown symbol',// bitfinex
							'invalid product',// bitflyer
							'unsupported currency pair',// bitstamp, coinbase
							`currency pair ${from}_${to} not found`,// coinmate
							'unsupported currency',// ibexmercado
							'unknown asset pair',// kraken
							'instrument ID does not exist',// okx
						].join('|'), 'i').test(error.message), error.message);
					});
				});
			});
		});
	});
});
