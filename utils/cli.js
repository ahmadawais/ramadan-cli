const meow = require('meow');
const meowHelp = require('cli-meow-help');

const commands = {
	city: {desc: `Name of a city to get information about.`},
	help: {desc: `Show help.`}
};

const flags = {
	all: {
		desc: `Show all days.`,
		type: 'boolean',
		default: false,
		alias: 'a'
	},
	school: {
		desc: `School the time is based on.`,
		type: 'string',
		default: `1`,
		alias: 's'
	}
};

const examples = [
	{command: `"San Francisco"`},
	{command: `san-francisco`, flags: [`all`]},
	{command: `lahore`, flags: [`all`]}
];

const helpText = meowHelp({
	name: `ramadan-cli`,
	flags,
	commands,
	examples
});

const options = {
	inferType: true,
	description: false,
	hardRejection: false,
	flags
};

module.exports = meow(helpText, options);
