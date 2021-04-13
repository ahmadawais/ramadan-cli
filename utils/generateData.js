const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const formatDate = require('./formatDate');
const ora = require('ora');
const spinner = ora({text: ''});
const {green: g, red: r, yellow: y, dim: d} = require('chalk');
const alert = require('cli-alerts');

(async () => {
	let baseDir = path.join(__dirname, '../data/');
	const BASE_URL =
		'https://hamariweb.com/islam/pakistan_ramadan-timings1.aspx?Page=';
	let cities = [];
	let citiesToSaveInFile = [];

	try {
		spinner.start(`${y(`FINDING`)} cities in Pakistan …`);
		for (let i = 1; i <= 4; i++) {
			const response = await axios.get(`${BASE_URL}${i}`);
			const $ = cheerio.load(response.data);
			$('#Region')
				.find('tbody > tr')
				.find('td > a')
				.each(function () {
					let city = $(this)
						.text()
						.replace(/[•\t.+]/g, '')
						.trim()
						.toLowerCase()
						.replace(/\s+/g, '-');
					let href = $(this).attr('href');
					citiesToSaveInFile.push(city);
					cities.push({
						name: city,
						timetableLink: `https://hamariweb.com/islam/${href}`
					});
				});
		}
		const citiesJSON = JSON.stringify(citiesToSaveInFile);
		const dataToWrite = `module.exports = ${citiesJSON}`;

		fs.writeFile(`./utils/cities.js`, dataToWrite, 'utf8', err => {
			if (err) throw err;
			spinner.succeed(
				`${g(`FOUND`)} ${citiesToSaveInFile.length} cities`
			);
		});

		for (let city of cities) {
			let data = [];
			const cityName = city.name.toUpperCase();

			spinner.start(`${y(`DATA`)} for ${cityName} …`);

			const timeTableResponse = await axios.get(`${city.timetableLink}`);
			const $ = cheerio.load(timeTableResponse.data);

			let columns = ['no', 'sehar', 'iftar', 'date'];
			let rows = [];

			$('#printable tbody tr').each((index, item) => {
				let row = [];
				let td = $(item).find('td');
				if (td.length > 0) {
					td.each((index, item) => {
						row.push($(item).text());
					});
					rows.push(row);
				}
			});

			rows.splice(0, 2);

			rows.forEach(row => {
				let roza = row.reduce((result, field, index) => {
					result[columns[index]] = field;
					return result;
				}, {});
				roza.no = `#${roza.no}`;
				roza.date = formatDate(roza.date);
				data.push(roza);
			});

			fs.writeFile(
				`${baseDir}/${city.name}.json`,
				JSON.stringify(data),
				'utf8',
				err => {
					if (err) throw err;
					spinner.succeed(`${g(cityName)}: Data saved`);
				}
			);
		}
	} catch (error) {
		alert({type: `error`, msg: `Something went wrong!`});
	}

	alert({
		type: `success`,
		msg: `Generated data for ${citiesToSaveInFile.length} cities!`
	});
})();
