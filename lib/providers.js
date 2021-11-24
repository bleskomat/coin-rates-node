module.exports = [
	{
		name: 'binance',
		label: 'Binance',
		url: 'https://api.binance.com/api/v3/ticker/price?symbol={{FROM}}{{TO}}',
		jsonPath: {
			data: 'price',
		},
		convertSymbols: {
			USD: 'USDT',
		},
	},
	{
		name: 'bitfinex',
		label: 'Bitfinex',
		url: 'https://api.bitfinex.com/v1/pubticker/{{from}}{{to}}',
		jsonPath: {
			error: 'message',
			data: 'last_price',
		},
	},
	{
		name: 'bitflyer',
		label: 'bitFlyer',
		url: 'https://api.bitflyer.com/v1/ticker?product_code={{FROM}}_{{TO}}',
		jsonPath: {
			error: 'error_message',
			data: 'ltp',
		},
	},
	{
		name: 'bitstamp',
		label: 'Bitstamp',
		url: 'https://www.bitstamp.net/api/v2/ticker/{{from}}{{to}}/',
		jsonPath: {
			error: 'message',
			data: 'last',
		},
	},
	{
		name: 'coinbase',
		label: 'Coinbase',
		url: 'https://api.coinbase.com/v2/exchange-rates?currency={{FROM}}',
		jsonPath: {
			error: 'errors',
			data: 'data.rates.{{TO}}',
		},
	},
	{
		name: 'coinmate',
		label: 'CoinMate.io',
		url: 'https://coinmate.io/api/ticker?currencyPair={{FROM}}_{{TO}}',
		jsonPath: {
			error: 'errorMessage',
			data: 'data.last',
		},
	},
	{
		name: 'kraken',
		label: 'Kraken',
		url: 'https://api.kraken.com/0/public/Ticker?pair={{FROM}}{{TO}}',
		convertSymbols: {
			BTC: 'XBT',
		},
		jsonPath: {
			error: 'error',
			data: 'result.X{{FROM}}Z{{TO}}.c.0',
		},
	},
	{
		name: 'poloniex',
		label: 'Poloniex',
		url: 'https://poloniex.com/public?command=returnTicker',
		convertSymbols: {
			USD: 'USDT',
		},
		jsonPath: {
			data: '{{TO}}_{{FROM}}.last',
		},
	},
];
