#!/usr/bin/env node

const sym = require('log-symbols');
const cli = require('./utils/cli.js');
const init = require('./utils/init.js');
const print = require('./utils/print.js');
const cities = require('./utils/cities.js');
const theEnd = require('./utils/theEnd.js');

// CLI.
const [input] = cli.input;
const all = cli.flags.all;
const notFound = `${sym.error} ${input}: not found.\n Consider contributing!`;

// Let's do it.
(async () => {
	init();
	input === 'help' && (await cli.showHelp(0));

	const city = input ? input.toLowerCase().replace(/\s+/g, '-') : `lahore`;
	const noData = input && cities.indexOf(city) === -1;

	noData && console.log(notFound);
	!noData && print({ all, city });

	theEnd({ city, noData });
})();
