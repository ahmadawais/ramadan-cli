const sym = require('log-symbols');
const Table = require('cli-table3');
const green = require('./green');
const {DateTime} = require('luxon');
const wishEid = `${sym.success} Eid Mubarak.\nRamadan is already over. Hope you had a fun time on Eid.\n`;
const getToday = require('./today');
const getAll = require('./all');
const ora = require('ora');
const spinner = ora({text: ''});
const {green: g, red: r, yellow: y, dim: d} = require('chalk');

module.exports = async ({city, school, all, firstRozaDateISO}) => {
	const single = !all;

	// Find the current roza.
	const firstRoza = DateTime.fromISO(firstRozaDateISO);
	const today = DateTime.local();
	const rozaNumber = Math.floor(today.diff(firstRoza, 'days').as('days')) + 1;

	// Still ramadan?
	if (rozaNumber > 31) {
		console.log(wishEid);
	} else {
		// Print table.
		const table = new Table({
			head: [green('Roza'), green('Sehar'), green('Iftar'), green('Date')]
		});

		if (all) {
			spinner.start(`${y(`FETCHING`)} times …`);
			const data = await getAll({city, school});
			spinner.stop();

			data.map(day => {
				if (isToday(day.date)) {
					table.push([
						green(day.no),
						green(day.sehar),
						green(day.iftar),
						green(day.date)
					]);
					return;
				}
				table.push([day.no, day.sehar, day.iftar, day.date]);
			});
		}

		if (single) {
			spinner.start(`${y(`FETCHING`)} times …`);
			const {sehar, iftar, date} = await getToday({city, school});
			spinner.stop();
			table.push([rozaNumber, sehar, iftar, date]);
		}

		// Do it.
		console.log(table.toString());
	}
};

function isToday(d) {
	const date = DateTime.fromISO(d);
	const today = DateTime.local();
	return (
		date.year === today.year &&
		date.month === today.month &&
		date.day === today.day
	);
}
