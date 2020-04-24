const sym = require('log-symbols');
const Table = require('cli-table3');
const dateDiff = require('./dateDiff');
const green = require('./green');
const wishEid = `${sym.success} Eid Mubarak.\nRamadan is already over. Hope you had a fun time on Eid.\n`;

module.exports = ({all, city}) => {
	// Import the right city.
	const data = require(`../data/${city}.json`);

	// Find the current roza.
	const firstRoza = '2020-04-25';
	const today = new Date().toISOString().substring(0, 10);
	const rozaNumber = dateDiff(firstRoza, today);

	// Still ramadan?
	if (rozaNumber > 30) {
		console.log(wishEid);
	} else {
		const roza = rozaNumber > 1 ? data[rozaNumber] : data[0];

		// Print table.
		const table = new Table({
			head: [green('Roza'), green('Sehar'), green('Iftar')]
		});

		// All or one.
		all && data.map(day => table.push([day.no, day.sehar, day.iftar]));
		!all && table.push([roza.no, roza.sehar, roza.iftar]);

		// Do it.
		console.log(table.toString());
	}
};
