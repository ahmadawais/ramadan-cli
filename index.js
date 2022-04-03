#!/usr/bin/env node

const cli = require('./utils/cli');
const init = require('./utils/init');
const print = require('./utils/print');
const theEnd = require('./utils/theEnd');

// CLI.
const [input] = cli.input;
const {school, all} = cli.flags;

// Let's do it.
(async () => {
	init();
	input === 'help' && (await cli.showHelp(0));
	!input && (await cli.showHelp(0));

	// replace all spaces with a - character
	const city = input.toLowerCase().replace(/\s/g, '-').trim();

	// → Set first ramazan date b3low.
	await print({city, school, all, firstRozaDateISO: `2022-04-03`});
	await theEnd({city});
})();
