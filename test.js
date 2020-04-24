/**
 * Testing with ava.
 *
 * @link https://github.com/avajs/ava/blob/master/docs/01-writing-tests.md
 */
const test = require('ava');
const execa = require('execa');

test('main', async t => {
	const {stdout} = await execa('./index.js', ['--version']);
	t.true(stdout.length > 0);
});
