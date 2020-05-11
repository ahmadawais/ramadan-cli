#!/usr/bin/env node

const sym = require('log-symbols');
const cli = require('./utils/cli.js');
const init = require('./utils/init.js');
const print = require('./utils/print.js');
const cities = require('./utils/cities.js');
const theEnd = require('./utils/theEnd.js');
const getTimetable = require('./utils/getTimetable');

// CLI.
const [input] = cli.input;
const all = cli.flags.all;
const notFound = `${sym.error} ${input}: not found.\n Consider contributing!`;

// Let's do it.
(async () => {
	init();
	input === 'help' && (await cli.showHelp(0));

	const city = input ? input.toLowerCase() : `lahore`;
	const data = await getTimetable(city);
	const noData = data.length === 0 ? true : undefined;

	noData && console.log(notFound);
	!noData && print({ all, city, data });

	theEnd({ city, noData });
})();
