const meow = require('meow');
const chalk = require('chalk');
const green = chalk.green;
const yellow = chalk.yellow;
const cyan = chalk.cyan;
const dim = chalk.dim;

module.exports = meow(
	`
	Usage
	  ${green(`ramadan-cli`)} ${cyan(`<command>`)} ${yellow(`[--option]`)}

	Commands
	  ${cyan(`cityName`)}    Get data for a city
	  ${cyan(`help`)}        Show help

	Options
	  ${yellow(`--all`)}, ${yellow(`-a`)}   Show all days

	Examples
	${green(`ramadan-cli`)} ${cyan(`lahore`)}
	${green(`ramadan-cli`)} ${cyan(`karachi`)} ${yellow(`--all`)}
	${green(`ramadan-cli`)} ${cyan(`help`)}
`,
	{
		booleanDefault: undefined,
		hardRejection: false,
		inferType: false,
		flags: {
			all: {
				type: 'boolean',
				default: false,
				alias: 'a'
			}
		}
	}
);
