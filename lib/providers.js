const assert = require('assert');

module.exports = [
	{
		name: 'anycoin',
		label: 'Anycoin',
		url: 'https://www.anycoin.cz/api/compact_rates',
		parseResponseBody: function(body, currencies) {
			let data = JSON.parse(body);
			let rate;
			const { FROM, TO } = currencies;
			const coinCode = `${FROM}${TO}`;
			data.data.find(item => {
				if (item.coin_code === coinCode) {
					rate = item.value;
					return true;
				}
			});
			assert.ok(rate, 'Unsupported currency pair');
			return rate;
		},
	},
	{
		name: 'binance',
		label: 'Binance',
		url: 'https://api.binance.com/api/v3/ticker/price?symbol={{FROM}}{{TO}}',
		convertSymbols: {
			USD: 'USDT',
		},
		parseResponseBody: function(body, currencies) {
			let data = JSON.parse(body);
			assert.ok(!data.code, data.msg);
			return data.price;
		},
	},
	{
		name: 'bitfinex',
		label: 'Bitfinex',
		url: 'https://api.bitfinex.com/v1/pubticker/{{from}}{{to}}',
		parseResponseBody: function(body, currencies) {
			let data = JSON.parse(body);
			assert.ok(!data.message, data.message);
			return data.last_price;
		},
	},
	{
		name: 'bitflyer',
		label: 'bitFlyer',
		url: 'https://api.bitflyer.com/v1/ticker?product_code={{FROM}}_{{TO}}',
		parseResponseBody: function(body, currencies) {
			let data = JSON.parse(body);
			assert.ok(!data.error_message, data.error_message);
			return data.ltp;
		},
	},
	{
		name: 'bitstamp',
		label: 'Bitstamp',
		url: 'https://www.bitstamp.net/api/v2/ticker/{{from}}{{to}}/',
		parseResponseBody: function(body, currencies) {
			assert.ok(!/not found/i.test(body), 'Unsupported currency pair');
			let data = JSON.parse(body);
			assert.ok(!data.message, data.message);
			return data.last;
		},
	},
	{
		name: 'coinbase',
		label: 'Coinbase',
		url: 'https://api.coinbase.com/v2/exchange-rates?currency={{FROM}}',
		parseResponseBody: function(body, currencies) {
			let data = JSON.parse(body);
			assert.ok(!data.errors, data.errors);
			const { TO } = currencies;
			const rate = data.data && data.data.rates && data.data.rates[TO];
			assert.ok(rate, 'Unsupported currency pair');
			return rate;
		},
	},
	{
		name: 'coinmate',
		label: 'CoinMate.io',
		url: 'https://coinmate.io/api/ticker?currencyPair={{FROM}}_{{TO}}',
		parseResponseBody: function(body, currencies) {
			let data = JSON.parse(body);
			assert.ok(!data.errorMessage, data.errorMessage);
			return data.data && data.data.last;
		},
	},
	{
		name: 'ibexmercado',
		label: 'IBEX',
		url: 'https://ibexhub.ibexmercado.com/currency/rate/{{to}}',
		convertSymbols: {
			'USD': '3',
			'GTQ': '4',
			'MXN': '5',
			'PLN': '6',
			'HNL': '7',
			'EUR': '8',
			'ARS': '9',
			'ARS_PA': '10',
			'BRL': '11',
			'KES': '12',
			'CHF': '13',
			'COP': '14',
			'NGN': '15',
			'SEK': '16',
			'AUD': '17',
			'CAD': '18',
			'DKK': '19',
			'GBP': '21',
			'HTG': '20',
			'ZAR': '22',
			'PHP': '23',
		},
		parseResponseBody: function(body, currencies) {
			let data = JSON.parse(body);
			const rate = data.amount;
			assert.ok(rate, 'Unsupported currency');
			return rate;
		},
	},
	{
		name: 'kraken',
		label: 'Kraken',
		url: 'https://api.kraken.com/0/public/Ticker?pair={{FROM}}{{TO}}',
		convertSymbols: {
			BTC: 'XBT',
		},
		parseResponseBody: function(body, currencies) {
			let data = JSON.parse(body);
			assert.deepStrictEqual(data.error, [], data.error);
			const { FROM, TO } = currencies;
			return data.result && data.result[`X${FROM}Z${TO}`] && data.result[`X${FROM}Z${TO}`]['c'] && data.result[`X${FROM}Z${TO}`]['c'][0];
		},
	},
	{
		name: 'okx',
		label: 'OKX',
		url: 'https://www.okx.com/api/v5/market/index-tickers?instId={{FROM}}-{{TO}}',
		parseResponseBody: function(body, currencies) {
			let data = JSON.parse(body);
			assert.ok(data.code === '0', data.msg);
			const rate = data.data && data.data[0] && data.data[0].idxPx;
			assert.ok(rate, 'Unsupported currency pair');
			return rate;
		},
	},
];
