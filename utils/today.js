const axios = require('axios');
const to = require('await-to-js').default;
const handleError = require('cli-handle-error');

module.exports = async ({city, school}) => {
	const endpoint = `https://api.pray.zone/v2/times/today.json?key=MagicKey&city=${city}&school=${school}&timeformat=1`;
	const [err, response] = await to(axios.get(endpoint));
	handleError(`City now found, typo?! Try again.`, err, false);

	const sehar = response.data.results.datetime[0].times['Fajr'];
	const iftar = response.data.results.datetime[0].times['Maghrib'];
	const date = response.data.results.datetime[0].date['gregorian'];

	return {sehar, iftar, date};
};
