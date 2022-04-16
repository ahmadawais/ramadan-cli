const axios = require('axios');
const to = require('await-to-js').default;
const handleError = require('cli-handle-error');

module.exports = async ({city, school}) => {
	const endpoint = `https://api.pray.zone/v2/times/dates.json?start=2022-04-03&end=2022-05-02&key=MagicKey&city=${city}&school=${school}&timeformat=1`;

	const [err, response] = await to(axios.get(endpoint));
	handleError(`City not found, typo?! Try again.`, err, false);

	const ramazan = response.data.results.datetime;

	const data = [];

	ramazan.map((roza, count) => {
		const no = count + 1;
		const sehar = roza.times['Fajr'];
		const iftar = roza.times['Maghrib'];
		const date = roza.date['gregorian'];
		data.push({no, sehar, iftar, date});
	});

	return data;
};
