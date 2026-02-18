import { createRequire } from 'node:module';
import { InvalidArgumentError, program } from 'commander';
import { ramadanCommand } from './commands/ramadan.js';
import { clearRamadanConfig } from './ramadan-config.js';

interface RootOptions {
	readonly city?: string | undefined;
	readonly all?: boolean | undefined;
	readonly number?: number | undefined;
	readonly plain?: boolean | undefined;
	readonly json?: boolean | undefined;
	readonly firstRozaDate?: string | undefined;
	readonly clearFirstRozaDate?: boolean | undefined;
}

const require = createRequire(import.meta.url);
const pkg = require('../package.json') as {
	readonly version: string;
};

const parseRozaNumber = (value: string): number => {
	const parsed = Number.parseInt(value, 10);
	const isInvalid =
		Number.isNaN(parsed) ||
		!Number.isInteger(parsed) ||
		parsed < 1 ||
		parsed > 30;

	if (isInvalid) {
		throw new InvalidArgumentError('Roza number must be between 1 and 30.');
	}

	return parsed;
};

program
	.name('ramadan-cli')
	.description('Ramadan CLI for Sehar and Iftar timings')
	.version(pkg.version, '-v, --version')
	.argument('[city]', 'City name (e.g. "Lahore" or "San Francisco")')
	.option('-c, --city <city>', 'City')
	.option('-a, --all', 'Show complete Ramadan month')
	.option('-n, --number <number>', 'Show a specific roza day (1-30)', parseRozaNumber)
	.option('-p, --plain', 'Plain text output')
	.option('-j, --json', 'JSON output')
	.option(
		'--first-roza-date <YYYY-MM-DD>',
		'Set and use a custom first roza date'
	)
	.option(
		'--clear-first-roza-date',
		'Clear custom first roza date and use API Ramadan date'
	)
	.action(async (cityArg: string | undefined, opts: RootOptions) => {
		await ramadanCommand({
			city: cityArg || opts.city,
			all: opts.all,
			rozaNumber: opts.number,
			plain: opts.plain,
			json: opts.json,
			firstRozaDate: opts.firstRozaDate,
			clearFirstRozaDate: opts.clearFirstRozaDate,
		});
	});

program
	.command('reset')
	.description('Clear saved Ramadan CLI configuration')
	.action(() => {
		clearRamadanConfig();
		console.log('Configuration reset.');
	});

program.parse();
