const axios = require('axios');
const cheerio = require('cheerio');
let fs = require('fs');
const path = require('path');

const getData = async () => {
	let baseDir = path.join(__dirname, '../data/');
	console.log(baseDir);
	const BASE_URL =
		'https://hamariweb.com/islam/pakistan_ramadan-timings1.aspx?Page=';
	let cities = [];
	let citiesToSaveInFile = [];

	try {
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
						city,
						timetableLink: `https://hamariweb.com/islam/${href}`
					});
				});
		}

		const citiesJSON = JSON.stringify(citiesToSaveInFile);
		const dataToWrite = `module.exports = ${citiesJSON}`;

		fs.writeFile(`./utils/cities.js`, dataToWrite, 'utf8', err => {
			if (err) throw err;
			console.log(`File has been saved`);
		});

		for (let city of cities) {
			let data = [];

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
				`${baseDir}/${city.city}.json`,
				JSON.stringify(data),
				'utf8',
				err => {
					if (err) throw err;
					console.log(`${city.city} File has been saved`);
				}
			);
		}
	} catch (error) {
		console.log('There might be problem with API!');
	}
};

function formatDate(date) {
	var d = new Date(date),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear();

	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;

	return [year, month, day].join('-');
}

getData();
