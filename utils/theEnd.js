const sym = require('log-symbols');
const {dim} = require('chalk');

module.exports = async () => {
	console.log(
		dim(
			`\n${sym.info} City: Lahore. Times for Fiqh Sunni\nFiqh Jafria: Sehar -10 mins | Iftar time +10 mins`
		)
	);
	console.log(
		`\n${sym.success} ${dim(
			`Star the repo for updates → https://git.io/ramadan-cli`
		)}\n${sym.info} ${dim(
			`Follow for more CLIs → https://twitter.com/MrAhmadAwais\n\n`
		)}`
	);
};
