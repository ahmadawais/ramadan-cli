#!/usr/bin/env node

// const {green, yellow, hex} = require('chalk');
const chalk = require('chalk');
const sym = require('log-symbols');
const cli = require('./utils/cli.js');
const init = require('./utils/init.js');
const theEnd = require('./utils/theEnd.js');
const handleError = require('cli-handle-error');
const data = require('./data/lahore.json');
const dateDiff = require('./utils/dateDiff');
const Table = require('cli-table3');
const green = string => chalk.hex(`#81EF96`)(string);

// CLI.
const [input] = cli.input;
const option = cli.flags.option;

(async () => {
	init();
	const firstRoza = '2020-04-25';
	const today = new Date().toISOString().substring(0, 10);
	const rozaNumber = dateDiff(firstRoza, '2020-06-10');
	if (rozaNumber > 30) {
		console.log(
			`${sym.success} Eid Mubarak.\nRamadan is already over. Hope you had a fun time on Eid.\n`
		);
	} else {
		const roza = rozaNumber > 1 ? data[rozaNumber] : data[0];

		const table = new Table({
			head: [green('Roza'), green('Sehar'), green('Iftar')]
		});

		table.push([roza.no, roza.sehar, roza.iftar]);
		console.log(table.toString());
	}
	theEnd();
})();
