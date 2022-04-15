const axios = require('axios');
const to = require('await-to-js').default;
const handleError = require('cli-handle-error');

module.exports = async ({city, school}) => {
	/**
	 * Local ISO strings, currently needed as datetime-local input values
	 * http://dev.w3.org/html5/markup/input.datetime-local.html#input.datetime-local.attrs.value
	 */
	Date.prototype.toLocaleISOString = function () {
		return new Date(this.getTime() - this.getTimezoneOffset() * 1000 * 60)
			.toISOString()
			.replace('Z', '');
	};
	const todayInISO = new Date().toLocaleISOString().split('T')[0];

	const endpoint = `https://api.pray.zone/v2/times/day.json?key=MagicKey&city=${city}&school=${school}&timeformat=1&date=${todayInISO}`;
	const [err, response] = await to(axios.get(endpoint));
	handleError(`City now found, typo?! Try again.`, err, false);

	const sehar = response.data.results.datetime[0].times['Fajr'];
	const iftar = response.data.results.datetime[0].times['Maghrib'];
	const date = response.data.results.datetime[0].date['gregorian'];

	return {sehar, iftar, date};
};
