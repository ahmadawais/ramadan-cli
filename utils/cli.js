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
	  ${cyan(`help`)}        Show help

	Options
	  ${yellow(`--all`)}, ${yellow(`-a`)}   Show all days

	Examples
	${green(`ramadan-cli`)} ${yellow(`--all`)}
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
