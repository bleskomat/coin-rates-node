const _ = require('underscore');

module.exports = [
	{
		name: 'binance',
		label: 'Binance',
		url: 'https://api.binance.com/api/v3/ticker/price?symbol={{FROM}}{{TO}}',
		convertSymbols: {
			USD: 'USDT',
		},
		parseResponseBody: function(body, currencies) {
			let data = JSON.parse(body);
			return data.price;
		},
	},
	{
		name: 'bitfinex',
		label: 'Bitfinex',
		url: 'https://api.bitfinex.com/v1/pubticker/{{from}}{{to}}',
		parseResponseBody: function(body, currencies) {
			let data = JSON.parse(body);
			if (!_.isEmpty(data.message)) {
				throw new Error(data.message);
			}
			return data.last_price;
		},
	},
	{
		name: 'bitflyer',
		label: 'bitFlyer',
		url: 'https://api.bitflyer.com/v1/ticker?product_code={{FROM}}_{{TO}}',
		parseResponseBody: function(body, currencies) {
			let data = JSON.parse(body);
			if (!_.isEmpty(data.error_message)) {
				throw new Error(data.error_message);
			}
			return data.ltp;
		},
	},
	{
		name: 'bitstamp',
		label: 'Bitstamp',
		url: 'https://www.bitstamp.net/api/v2/ticker/{{from}}{{to}}/',
		parseResponseBody: function(body, currencies) {
			let data = JSON.parse(body);
			if (!_.isEmpty(data.message)) {
				throw new Error(data.message);
			}
			return data.last;
		},
	},
	{
		name: 'coinbase',
		label: 'Coinbase',
		url: 'https://api.coinbase.com/v2/exchange-rates?currency={{FROM}}',
		parseResponseBody: function(body, currencies) {
			let data = JSON.parse(body);
			if (!_.isEmpty(data.errors)) {
				throw new Error(data.errors);
			}
			const { TO } = currencies;
			return data.data && data.data.rates && data.data.rates[TO];
		},
	},
	{
		name: 'coinmate',
		label: 'CoinMate.io',
		url: 'https://coinmate.io/api/ticker?currencyPair={{FROM}}_{{TO}}',
		parseResponseBody: function(body, currencies) {
			let data = JSON.parse(body);
			if (!_.isEmpty(data.errorMessage)) {
				throw new Error(data.errorMessage);
			}
			return data.data && data.data.last;
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
			if (!_.isEmpty(data.error)) {
				throw new Error(data.error);
			}
			const { FROM, TO } = currencies;
			return data.result && data.result[`X${FROM}Z${TO}`] && data.result[`X${FROM}Z${TO}`]['c'] && data.result[`X${FROM}Z${TO}`]['c'][0];
		},
	},
	{
		name: 'poloniex',
		label: 'Poloniex',
		url: 'https://poloniex.com/public?command=returnTicker',
		convertSymbols: {
			USD: 'USDT',
		},
		parseResponseBody: function(body, currencies) {
			let data = JSON.parse(body);
			const { FROM, TO } = currencies;
			return data[`${TO}_${FROM}`] && data[`${TO}_${FROM}`]['last'];
		},
	},
];
