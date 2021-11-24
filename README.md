# coin-rates

Fetch currency exchange rate for a coin/fiat currency pair in nodejs.

* [Installation](#installation)
* [Usage](#usage)
* [Tests](#tests)
* [Changelog](#changelog)
* [License](#license)


## Installation

Add to your application via `npm`:
```
npm install coin-rates --save
```
This will install `coin-rates` and add it to your application's `package.json` file.


## Usage

```js
const coinRates = require('coin-rates');

coinRates.get({
	provider: 'kraken',
	currencies: {
		from: 'BTC',
		to: 'EUR',
	},
}).then(rate => {
	console.log(rate);
}).catch(error => {
	console.error(error);
})
```


## Tests

Run automated tests as follows:
```bash
npm test
```


## Changelog

See [CHANGELOG.md](https://github.com/samotari/coin-rates-node/blob/master/CHANGELOG.md)


## License

This software is [MIT licensed](https://tldrlegal.com/license/mit-license):
> A short, permissive software license. Basically, you can do whatever you want as long as you include the original copyright and license notice in any copy of the software/source.  There are many variations of this license in use.
